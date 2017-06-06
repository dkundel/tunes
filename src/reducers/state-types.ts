export type PlayerStatus =
  | 'stopped'
  | 'paused'
  | 'playing'
  | 'loading'
  | 'resuming'
  | undefined;

export interface SongInfo {
  title: string;
  totalTime: number;
  percentage: number;
  currentTime: number;
  videoId: string;
}

export interface PlayerState {
  currentSong: SongInfo | undefined;
  currentPlayList: string | undefined;
  currentPlayerStatus: PlayerStatus;
  songQueue: string[];
  queueIndex: number | undefined;
  nextPlayerStatus: PlayerStatus;
}

export interface GlobalState {
  player: PlayerState;
}
