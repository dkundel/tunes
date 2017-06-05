export type CurrentPlayerStatus = 'stopped' | 'paused' | 'playing' | 'loading';

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
  currentPlayerStatus: CurrentPlayerStatus;
  songQueue: string[];
}

export interface GlobalState {
  player: PlayerState;
}
