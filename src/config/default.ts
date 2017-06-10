export interface Shortcuts {
  showHide: string;
  playPause: string;
  next: string;
  prev: string;
  load: string;
}

export interface Config {
  shortcuts: Shortcuts;
}

export const DefaultConfig: Config = {
  shortcuts: {
    showHide: 'CmdOrCtrl+Shift+U',
    load: 'CmdOrCtrl+Shift+Y',
    playPause: 'MediaPlayPause',
    prev: 'MediaPreviousTrack',
    next: 'MediaNextTrack'
  }
};

export default DefaultConfig;
