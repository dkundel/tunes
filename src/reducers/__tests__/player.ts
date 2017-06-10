jest.mock('electron');

import { Action } from 'redux';
import { ipcRenderer } from 'electron';

import reducer, * as getters from '../player';
import { PlayerState, PlayerStatus, SongInfo } from '../state-types';
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

  describe('should handle NEXT_SONG', () => {
    test('with an empty queue', () => {
      expect(
        reducer(initialState, {
          type: actions.NEXT_SONG
        })
      ).toEqual({
        ...initialState,
        queueIndex: 0,
        nextPlayerStatus: 'loading'
      });
    });

    test('advances correctly', () => {
      const currentState = {
        ...initialState,
        songQueue: ['unit', 'test']
      };
      expect(
        reducer(currentState, {
          type: actions.NEXT_SONG
        })
      ).toEqual({
        ...currentState,
        queueIndex: 1,
        nextPlayerStatus: 'loading'
      });
    });

    test('wraps correctly', () => {
      const currentState = {
        ...initialState,
        queueIndex: 1,
        songQueue: ['unit', 'test']
      };
      expect(
        reducer(currentState, {
          type: actions.NEXT_SONG
        })
      ).toEqual({
        ...currentState,
        queueIndex: 0,
        nextPlayerStatus: 'loading'
      });
    });

    test('handles queue with 1 element', () => {
      const currentState = {
        ...initialState,
        queueIndex: 0,
        songQueue: ['unit']
      };
      expect(
        reducer(currentState, {
          type: actions.NEXT_SONG
        })
      ).toEqual({
        ...currentState,
        queueIndex: 0,
        nextPlayerStatus: 'loading'
      });
    });

    test('handles playlist', () => {
      const currentState = {
        ...initialState,
        queueIndex: 2,
        currentPlaylist: 'someid'
      };
      expect(
        reducer(currentState, {
          type: actions.NEXT_SONG
        })
      ).toEqual({
        ...currentState,
        queueIndex: 3,
        nextPlayerStatus: 'loading'
      });
    });
  });

  describe('should handle PREV_SONG', () => {
    test('with an empty queue', () => {
      expect(
        reducer(initialState, {
          type: actions.PREV_SONG
        })
      ).toEqual({
        ...initialState,
        queueIndex: 0,
        nextPlayerStatus: 'loading'
      });
    });

    test('wraps correctly', () => {
      const currentState = { ...initialState, songQueue: ['unit', 'test'] };
      expect(
        reducer(currentState, {
          type: actions.PREV_SONG
        })
      ).toEqual({
        ...currentState,
        queueIndex: 1,
        nextPlayerStatus: 'loading'
      });
    });

    test('moves correctly', () => {
      const currentState = {
        ...initialState,
        queueIndex: 2,
        songQueue: ['unit', 'test', 'anotherone']
      };
      expect(
        reducer(currentState, {
          type: actions.PREV_SONG
        })
      ).toEqual({
        ...currentState,
        queueIndex: 1,
        nextPlayerStatus: 'loading'
      });
    });

    test('handles queue with 1 element', () => {
      const currentState = {
        ...initialState,
        queueIndex: 0,
        songQueue: ['unit']
      };
      expect(
        reducer(currentState, {
          type: actions.PREV_SONG
        })
      ).toEqual({
        ...currentState,
        queueIndex: 0,
        nextPlayerStatus: 'loading'
      });
    });

    test('handles playlist', () => {
      const currentState = {
        ...initialState,
        queueIndex: 2,
        currentPlaylist: 'someid'
      };
      expect(
        reducer(currentState, {
          type: actions.PREV_SONG
        })
      ).toEqual({
        ...currentState,
        queueIndex: 1,
        nextPlayerStatus: 'loading'
      });
    });

    test('handles going negative', () => {
      const currentState = {
        ...initialState,
        queueIndex: 0,
        currentPlaylist: 'someid'
      };
      expect(
        reducer(currentState, {
          type: actions.PREV_SONG
        })
      ).toEqual({
        ...currentState,
        queueIndex: 0,
        nextPlayerStatus: 'loading'
      });
    });
  });

  describe('should handle TOGGLE_PLAYER', () => {
    test('should handle initial state', () => {
      expect(
        reducer(initialState, {
          type: actions.TOGGLE_PLAYER
        })
      ).toEqual({ ...initialState, nextPlayerStatus: 'resuming' });
    });

    test('should pause song', () => {
      const currentPlayerStatus: PlayerStatus = 'playing';
      const currentState = { ...initialState, currentPlayerStatus };
      expect(
        reducer(currentState, {
          type: actions.TOGGLE_PLAYER
        })
      ).toEqual({ ...currentState, nextPlayerStatus: 'paused' });
    });

    test('should resume on any state', () => {
      const currentPlayerStatus: PlayerStatus = 'loading';
      const currentState = { ...initialState, currentPlayerStatus };
      expect(
        reducer(currentState, {
          type: actions.TOGGLE_PLAYER
        })
      ).toEqual({ ...currentState, nextPlayerStatus: 'resuming' });

      expect(
        reducer(
          { ...currentState, currentPlayerStatus: 'stopped' },
          {
            type: actions.TOGGLE_PLAYER
          }
        )
      ).toEqual({
        ...currentState,
        currentPlayerStatus: 'stopped',
        nextPlayerStatus: 'resuming'
      });

      expect(
        reducer(
          { ...currentState, currentPlayerStatus: 'resuming' },
          { type: actions.TOGGLE_PLAYER }
        )
      ).toEqual({
        ...currentState,
        currentPlayerStatus: 'resuming',
        nextPlayerStatus: 'resuming'
      });
    });
  });

  describe('should handle PROGRESS_SONG', () => {
    test('handles initial state', () => {
      expect(
        reducer(undefined, {
          type: actions.PROGRESS_SONG,
          progress: {
            currentTime: 42,
            totalTime: 99,
            percentage: 42.4
          }
        })
      ).toEqual(initialState);
    });

    test('updates song info correctly', () => {
      const songInfo: SongInfo = {
        title: 'My Unit Test',
        currentTime: 0,
        percentage: 0,
        totalTime: 10,
        videoId: 'someid'
      };

      expect(
        reducer(
          { ...initialState, currentSong: songInfo },
          {
            type: actions.PROGRESS_SONG,
            progress: {
              currentTime: 42,
              totalTime: 99,
              percentage: 42.4
            }
          }
        )
      ).toEqual({
        ...initialState,
        currentSong: {
          ...songInfo,
          currentTime: 42,
          totalTime: 99,
          percentage: 42.4
        }
      });
    });
  });

  describe('should handle CHANGE_PLAYER_STATUS', () => {
    beforeEach(() => {
      (ipcRenderer.send as jest.Mock<undefined>).mockClear();
    });

    test('handles initial state', () => {
      expect(
        reducer(undefined, {
          type: actions.CHANGE_PLAYER_STATUS,
          status: 'playing'
        })
      ).toEqual({ ...initialState, currentPlayerStatus: 'playing' });
      expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
      expect(ipcRenderer.send).toHaveBeenCalledWith('tray:icon', 'playing');
    });

    test('resets nextPlayerStatus', () => {
      const currentStatus = {
        ...initialState,
        nextPlayerStatus: 'resuming' as PlayerStatus
      };
      expect(
        reducer(currentStatus, {
          type: actions.CHANGE_PLAYER_STATUS,
          status: 'playing'
        })
      ).toEqual({
        ...currentStatus,
        nextPlayerStatus: undefined,
        currentPlayerStatus: 'playing'
      });
      expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
      expect(ipcRenderer.send).toHaveBeenCalledWith('tray:icon', 'playing');
    });

    test('sets tray icon to default for others', () => {
      const currentStatus = {
        ...initialState,
        nextPlayerStatus: 'resuming' as PlayerStatus
      };
      expect(
        reducer(currentStatus, {
          type: actions.CHANGE_PLAYER_STATUS,
          status: 'paused'
        })
      ).toEqual({
        ...currentStatus,
        nextPlayerStatus: undefined,
        currentPlayerStatus: 'paused'
      });
      expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
      expect(ipcRenderer.send).toHaveBeenCalledWith('tray:icon', 'default');
    });
  });

  describe('should handle LOAD_PLAYLIST', () => {
    test('handles initial state', () => {
      expect(
        reducer(undefined, {
          type: actions.LOAD_PLAYLIST,
          playlist: 'someid'
        })
      ).toEqual({
        ...initialState,
        currentPlaylist: 'someid',
        nextPlayerStatus: 'playing'
      });
    });

    test('handles overriding existing playlist', () => {
      expect(
        reducer(
          { ...initialState, currentPlaylist: 'someotherid' },
          {
            type: actions.LOAD_PLAYLIST,
            playlist: 'someid'
          }
        )
      ).toEqual({
        ...initialState,
        currentPlaylist: 'someid',
        nextPlayerStatus: 'playing'
      });
    });
  });

  describe('should handle SET_QUEUE_INDEX', () => {
    test('handles initial state', () => {
      expect(
        reducer(undefined, {
          type: actions.SET_QUEUE_INDEX,
          index: 99
        })
      ).toEqual({ ...initialState, queueIndex: 99 });
    });

    test('overrides existing queue index', () => {
      expect(
        reducer(
          { ...initialState, queueIndex: 42 },
          {
            type: actions.SET_QUEUE_INDEX,
            index: 99
          }
        )
      ).toEqual({ ...initialState, queueIndex: 99 });
    });
  });

  describe('should handle SET_SONG_INFO', () => {
    test('handles initial state', () => {
      const songInfo: SongInfo = {
        title: 'My Unit Test',
        currentTime: 0,
        percentage: 0,
        totalTime: 10,
        videoId: 'someid'
      };

      expect(
        reducer(undefined, {
          type: actions.SET_SONG_INFO,
          songInfo
        })
      ).toEqual({ ...initialState, currentSong: songInfo });
    });

    test('overrides existing queue index', () => {
      const songInfo: SongInfo = {
        title: 'My Unit Test',
        currentTime: 0,
        percentage: 0,
        totalTime: 10,
        videoId: 'someid'
      };
      expect(
        reducer(
          {
            ...initialState,
            currentSong: {
              ...songInfo,
              title: 'Initial Video',
              videoId: 'hello'
            }
          },
          { type: actions.SET_SONG_INFO, songInfo }
        )
      ).toEqual({ ...initialState, currentSong: songInfo });
    });
  });
});

describe('getters for player state', () => {
  test('getPlayerStatus returns player status', () => {
    const state = {
      player: {
        ...initialState,
        currentPlayerStatus: 'loading' as PlayerStatus
      }
    };
    expect(getters.getPlayerStatus(state)).toBe('loading');
  });

  test('getNextPlayerStatus returns next status', () => {
    const state = {
      player: { ...initialState, nextPlayerStatus: 'resuming' as PlayerStatus }
    };
    expect(getters.getNextPlayerStatus(state)).toBe('resuming');
  });

  test('getCurrentQueue returns queue', () => {
    const state = {
      player: { ...initialState, songQueue: ['song1', 'song2'] }
    };
    expect(getters.getCurrentQueue(state)).toEqual(['song1', 'song2']);
  });

  test('getCurrentPlaylist returns playlist', () => {
    const state = { player: { ...initialState, currentPlaylist: 'someid' } };
    expect(getters.getCurrentPlaylist(state)).toEqual('someid');
  });

  test('getQueueIndex returns correct index', () => {
    const state = { player: { ...initialState, queueIndex: 42 } };
    expect(getters.getQueueIndex(state)).toBe(42);
  });

  test('getCurrentSongInfo returns song info', () => {
    const songInfo: SongInfo = {
      title: 'My Unit Test',
      currentTime: 0,
      percentage: 0,
      totalTime: 10,
      videoId: 'someid'
    };
    const state = { player: { ...initialState, currentSong: songInfo } };
    expect(getters.getCurrentSongInfo(state)).toEqual(songInfo);
  });
});
