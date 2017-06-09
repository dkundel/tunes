import { Action } from 'redux';
import { PlayerStatus, SongInfo } from '../reducers/state-types';

export const ADD_SONG = 'ADD_SONG';
export const NEXT_SONG = 'NEXT_SONG';
export const PREV_SONG = 'PREV_SONG';
export const TOGGLE_PLAYER = 'TOGGLE_PLAYER';
export const PROGRESS_SONG = 'PROGRESS_SONG';
export const CHANGE_PLAYER_STATUS = 'CHANGE_PLAYER_STATUS';
export const SET_QUEUE_INDEX = 'SET_QUEUE_INDEX';
export const LOAD_PLAYLIST = 'LOAD_PLAYLIST';
export const TOGGLE_INSTRUCTIONS = 'TOGGLE_INSTRUCTIONS';
export const SET_SONG_INFO = 'SET_SONG_INFO';

export interface AddSongAction extends Action {
  song: string;
}

export interface LoadPlaylistAction extends Action {
  playlist: string;
}

export interface ChangePlayerStatusAction extends Action {
  status: PlayerStatus;
}

export interface SetQueueIndexAction extends Action {
  index: number;
}

export interface SetSongInfoAtion extends Action {
  songInfo: SongInfo;
}

export interface ProgressSongAction extends Action {
  progress: {
    currentTime: number;
    totalTime: number;
    percentage: number;
  };
}

export const addSong = (song: string) => ({ type: ADD_SONG, song });
export const nextSong = () => ({ type: NEXT_SONG });
export const prevSong = () => ({ type: PREV_SONG });
export const togglePlayer = () => ({ type: TOGGLE_PLAYER });
export const loadPlaylist = (playlist: string) => ({
  type: LOAD_PLAYLIST,
  playlist
});
export const changePlayerStatus = (status: PlayerStatus) => ({
  type: CHANGE_PLAYER_STATUS,
  status
});
export const setQueueIndex = (index: number) => ({
  type: SET_QUEUE_INDEX,
  index
});
export const setSongInfo = (songInfo: SongInfo) => ({
  type: SET_SONG_INFO,
  songInfo
});
export const setProgress = (
  currentTime: number,
  totalTime: number,
  percentage: number
) => ({
  type: PROGRESS_SONG,
  progress: {
    currentTime,
    totalTime,
    percentage
  }
});
export const toggleInstructions = () => ({ type: TOGGLE_INSTRUCTIONS });
