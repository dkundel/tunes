import * as actions from '../PlayerActions';

describe('player actions', () => {
  test('should create add song action', () => {
    const song = 'my favorite song';
    const expectedAction = {
      type: actions.ADD_SONG,
      song
    };
    expect(actions.addSong(song)).toEqual(expectedAction);
  });

  test('should create next song action', () => {
    const expectedAction = { type: actions.NEXT_SONG };
    expect(actions.nextSong()).toEqual(expectedAction);
  });

  test('should create prev song action', () => {
    const expectedAction = { type: actions.PREV_SONG };
    expect(actions.prevSong()).toEqual(expectedAction);
  });

  test('should create toggle player action', () => {
    const expectedAction = { type: actions.TOGGLE_PLAYER };
    expect(actions.togglePlayer()).toEqual(expectedAction);
  });

  test('should create load playlist action', () => {
    const playlist = 'myplaylist';
    const expectedAction = { type: actions.LOAD_PLAYLIST, playlist };
    expect(actions.loadPlaylist(playlist)).toEqual(expectedAction);
  });

  test('should create change playerstatus action', () => {
    const status = 'playing';
    const expectedAction = { type: actions.CHANGE_PLAYER_STATUS, status };
    expect(actions.changePlayerStatus(status)).toEqual(expectedAction);
  });

  test('should create set queue index action', () => {
    const index = 1;
    const expectedAction = { type: actions.SET_QUEUE_INDEX, index };
    expect(actions.setQueueIndex(index)).toEqual(expectedAction);
  });

  test('should create set song info action', () => {
    const songInfo = {
      title: 'Song Name',
      totalTime: 0,
      percentage: 0,
      currentTime: 0,
      videoId: 'someid'
    };
    const expectedAction = { type: actions.SET_SONG_INFO, songInfo };
    expect(actions.setSongInfo(songInfo)).toEqual(expectedAction);
  });

  test('should create set progress action', () => {
    const totalTime = 10;
    const currentTime = 0;
    const percentage = 0;
    const progress = { totalTime, currentTime, percentage };
    const expectedAction = { type: actions.PROGRESS_SONG, progress };
    expect(actions.setProgress(currentTime, totalTime, percentage)).toEqual(
      expectedAction
    );
  });
});
