jest.mock('electron');

import { Action } from 'redux';
import reducer from '../player';
import { PlayerState } from '../state-types';
import * as actions from '../../actions/PlayerActions';

const initialState: PlayerState = {
  currentSong: undefined,
  currentPlaylist: undefined,
  currentPlayerStatus: 'stopped',
  songQueue: [],
  queueIndex: undefined,
  nextPlayerStatus: undefined
};

describe('player reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {} as Action)).toEqual(initialState);
  });

  test('should handle ADD_SONG', () => {
    expect(
      reducer(initialState, { type: actions.ADD_SONG, song: 'hello' })
    ).toEqual({
      ...initialState,
      songQueue: ['hello']
    });
  });

  // TODO: Add more tests for reducer scenarios
});
