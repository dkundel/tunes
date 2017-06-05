import { Action } from 'redux';

export const ADD_SONG = 'ADD_SONG';
export const NEXT_SONG = 'NEXT_SONG';
export const PREV_SONG = 'PREV_SONG';
export const TOGGLE_PLAYER = 'TOGGLE_PLAYER';
export const PROGRESS_SONG = 'PROGRESS_SONG';
export const CHANGE_PLAYER_STATE = 'CHANGE_PLAYER_STATE';
export const LOAD_PLAYLIST = 'LOAD_PLAYLIST';
export const TOGGLE_INSTRUCTIONS = 'TOGGLE_INSTRUCTIONS';

export interface AddSongAction extends Action {
  song: string;
}

export interface LoadPlayListAction extends Action {
  playList: string;
}

export const addSong = (song: string) => ({ type: ADD_SONG, song: song });
export const nextSong = () => ({ type: NEXT_SONG });
export const prevSong = () => ({ type: PREV_SONG });
export const togglePlayer = () => ({ type: TOGGLE_PLAYER });
export const loadPlayList = (playList: string) => ({
  type: LOAD_PLAYLIST,
  playList: playList
});
export const toggleInstructions = () => ({ type: TOGGLE_INSTRUCTIONS });
