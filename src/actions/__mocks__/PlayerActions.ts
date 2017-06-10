export const togglePlayer = jest.fn(() => ({ type: 'TOGGLE_PLAYER' }));
export const nextSong = jest.fn(() => ({ type: 'NEXT_SONG' }));
export const prevSong = jest.fn(() => ({ type: 'PREV_SONG' }));
export const loadPlaylist = jest.fn((playlist: string) => ({
  type: 'LOAD_PLAYLIST',
  playlist
}));
export const addSong = jest.fn((song: string) => ({ type: 'ADD_SONG', song }));
