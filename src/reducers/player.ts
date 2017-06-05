import {
  ADD_SONG,
  NEXT_SONG,
  PREV_SONG,
  TOGGLE_PLAYER,
  LOAD_PLAYLIST,
  CHANGE_PLAYER_STATE,
  PROGRESS_SONG,
  AddSongAction,
  LoadPlayListAction
} from '../actions';

import { Action } from 'redux';

import {
  CurrentPlayerStatus,
  GlobalState,
  PlayerState,
  SongInfo
} from './state-types';

const initialState: PlayerState = {
  currentSong: undefined,
  currentPlayList: undefined,
  currentPlayerStatus: 'stopped',
  songQueue: []
};

export default function(state: PlayerState = initialState, action: Action) {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case ADD_SONG:
      newState.songQueue = [
        ...newState.songQueue,
        (action as AddSongAction).song
      ];
      break;
    case NEXT_SONG:
      break;
    case PREV_SONG:
      break;
    case TOGGLE_PLAYER:
      break;
    case PROGRESS_SONG:
      break;
    case CHANGE_PLAYER_STATE:
      break;
    case LOAD_PLAYLIST:
      newState.currentPlayList = (action as LoadPlayListAction).playList;
      break;
  }

  return newState;
}

export const getPlayerStatus = (state: GlobalState): CurrentPlayerStatus => {
  return state.player.currentPlayerStatus;
};

export const getCurrentQueue = (state: GlobalState): string[] => {
  return state.player.songQueue;
};

export const getCurrentSongInfo = (
  state: GlobalState
): SongInfo | undefined => {
  return state.player.currentSong;
};
