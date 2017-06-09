import { ipcRenderer } from 'electron';

import {
  ADD_SONG,
  NEXT_SONG,
  PREV_SONG,
  TOGGLE_PLAYER,
  LOAD_PLAYLIST,
  CHANGE_PLAYER_STATUS,
  PROGRESS_SONG,
  SET_QUEUE_INDEX,
  SET_SONG_INFO,
  AddSongAction,
  ChangePlayerStatusAction,
  LoadPlaylistAction,
  SetQueueIndexAction,
  SetSongInfoAtion,
  ProgressSongAction
} from '../actions/PlayerActions';

import {
  PlayerStatus,
  GlobalState,
  PlayerState,
  SongInfo
} from './state-types';

const initialState: PlayerState = {
  currentSong: undefined,
  currentPlaylist: undefined,
  currentPlayerStatus: 'stopped',
  songQueue: [],
  queueIndex: undefined,
  nextPlayerStatus: undefined
};

export default function(state: PlayerState = initialState, action: any) {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case ADD_SONG:
      newState.songQueue = [
        ...newState.songQueue,
        (action as AddSongAction).song
      ];
      break;
    case NEXT_SONG:
      newState.queueIndex = newState.queueIndex || 0;
      if (Array.isArray(newState.songQueue) && newState.songQueue.length > 0) {
        newState.queueIndex =
          (newState.queueIndex + 1) % newState.songQueue.length;
      } else if (newState.currentPlaylist) {
        newState.queueIndex = newState.queueIndex + 1;
      }
      newState.nextPlayerStatus = 'loading';
      break;
    case PREV_SONG:
      newState.queueIndex = newState.queueIndex || 0;
      if (Array.isArray(newState.songQueue) && newState.songQueue.length > 0) {
        newState.queueIndex =
          (newState.queueIndex - 1 + newState.songQueue.length) %
          newState.songQueue.length;
      } else if (newState.currentPlaylist) {
        newState.queueIndex = newState.queueIndex - 1;
      }
      if (newState.queueIndex < 0) {
        newState.queueIndex = 0;
      }
      newState.nextPlayerStatus = 'loading';
      break;
    case TOGGLE_PLAYER:
      if (newState.currentPlayerStatus === 'playing') {
        newState.nextPlayerStatus = 'paused';
      } else {
        newState.nextPlayerStatus = 'resuming';
      }
      break;
    case PROGRESS_SONG:
      if (newState.currentSong !== undefined) {
        newState.currentSong = Object.assign({}, newState.currentSong);
        const { progress } = action as ProgressSongAction;
        newState.currentSong.currentTime = progress.currentTime;
        newState.currentSong.totalTime = progress.totalTime;
        newState.currentSong.percentage = progress.percentage;
      }
      break;
    case CHANGE_PLAYER_STATUS:
      newState.nextPlayerStatus = undefined;
      newState.currentPlayerStatus = (action as ChangePlayerStatusAction).status;
      if (newState.currentPlayerStatus === 'playing') {
        ipcRenderer.send('tray:icon', 'playing');
      } else {
        ipcRenderer.send('tray:icon', 'default');
      }
      break;
    case LOAD_PLAYLIST:
      newState.currentPlaylist = (action as LoadPlaylistAction).playlist;
      newState.nextPlayerStatus = 'playing';
      break;
    case SET_QUEUE_INDEX:
      newState.queueIndex = (action as SetQueueIndexAction).index;
      break;
    case SET_SONG_INFO:
      newState.currentSong = (action as SetSongInfoAtion).songInfo;
      break;
  }

  return newState;
}

export const getPlayerStatus = (state: GlobalState): PlayerStatus => {
  return state.player.currentPlayerStatus;
};

export const getNextPlayerStatus = (state: GlobalState): PlayerStatus => {
  return state.player.nextPlayerStatus;
};

export const getCurrentQueue = (state: GlobalState): string[] => {
  return state.player.songQueue;
};

export const getCurrentPlaylist = (state: GlobalState): string | undefined => {
  return state.player.currentPlaylist;
};

export const getQueueIndex = (state: GlobalState): number | undefined => {
  return state.player.queueIndex;
};

export const getCurrentSongInfo = (
  state: GlobalState
): SongInfo | undefined => {
  return state.player.currentSong;
};
