import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { GlobalState, PlayerStatus, SongInfo } from '../reducers';
import {
  getPlayerStatus,
  getCurrentQueue,
  getCurrentPlayList,
  getQueueIndex,
  getNextPlayerStatus
} from '../reducers/player';
import {
  changePlayerStatus,
  setQueueIndex,
  nextSong,
  setSongInfo,
  setProgress
} from '../actions';

export const YOUTUBE_PLAYER_DOM_ID = 'youTubePlayer';

export interface YouTubePlayerProps {
  currentPlayList?: string | undefined;
  playerStatus?: PlayerStatus;
  currentQueue?: string[] | undefined;
  nextStatus?: PlayerStatus;
  queueIndex?: number | undefined;
  updatePlayerStatus?: (status: PlayerStatus) => any;
  updateQueueIndex?: (index: number) => any;
  nextSong?: () => any;
  setSongInfo?: (info: SongInfo) => any;
  setProgress?: (
    currentTime: number,
    totalTime: number,
    percentage: number
  ) => any;
}

export type YouTubeVideoData = {
  author: string;
  list: string;
  title: string;
  video_id: string;
  video_quality: string;
};

interface extendedYTPlayer extends YT.Player {
  getVideoData(): YouTubeVideoData;
}

type YTOnReadyEvent = { target: extendedYTPlayer };

class YouTubePlayer extends React.Component<YouTubePlayerProps, undefined> {
  private player: extendedYTPlayer | null;
  private timer: NodeJS.Timer | undefined;

  private loadVideo() {
    const defaultOptions: YT.PlayerOptions = {
      width: 300,
      height: 600,
      events: {
        onReady: this.onReady.bind(this),
        onStateChange: this.onStateChange.bind(this),
        onError: this.onError.bind(this)
      },
      videoId: ''
    };

    if (this.props.currentPlayList) {
      if (this.player === null) {
        defaultOptions.playerVars = {
          list: this.props.currentPlayList
        };
        new YT.Player(YOUTUBE_PLAYER_DOM_ID, defaultOptions);
      } else {
        this.player.playVideoAt(this.props.queueIndex || 0);
      }
    } else if (this.props.currentQueue && this.props.queueIndex !== undefined) {
      defaultOptions.videoId = this.props.currentQueue[this.props.queueIndex];
      new YT.Player(YOUTUBE_PLAYER_DOM_ID, defaultOptions);
    }
  }

  private updateTimeOfPlayer() {
    if (!this.player) {
      return;
    }

    if (this.props.setProgress) {
      const currentTime = this.player.getCurrentTime();
      const totalTime = this.player.getDuration();
      const percentage = Math.round(currentTime / totalTime * 10000) / 100.0;
      this.props.setProgress(currentTime, totalTime, percentage);
    }
  }

  private handleTimer(playerState: YT.PlayerState) {
    if (playerState === YT.PlayerState.PLAYING) {
      this.timer = setInterval(() => {
        this.updateTimeOfPlayer();
      }, 1000);
    } else {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
    }
  }

  private onReady(evt: YTOnReadyEvent) {
    if (evt.target) {
      this.player = evt.target;
      this.player.playVideo();
      window['player'] = this.player;
    }
  }

  private onError() {
    // TODO: track blocked videos
    if (this.props.nextSong) {
      this.props.nextSong();
    }
  }

  private onStateChange(evt: YT.OnStateChangeEvent) {
    if (
      !this.player ||
      !this.props.updateQueueIndex ||
      !this.props.updatePlayerStatus ||
      !this.props.nextSong ||
      !this.props.setSongInfo
    ) {
      return;
    }

    this.handleTimer(evt.data);

    /*if (evt.data === YT.PlayerState.UNSTARTED) {
      this.props.updatePlayerStatus('loading');
    } else */
    if (evt.data === YT.PlayerState.PLAYING) {
      this.props.updatePlayerStatus('playing');
      if (this.props.currentPlayList) {
        this.props.updateQueueIndex(this.player.getPlaylistIndex());
      }
      const videoData = this.player.getVideoData();
      const songInfo: SongInfo = {
        currentTime: this.player.getCurrentTime(),
        percentage: 0,
        title: videoData.title,
        videoId: videoData.video_id,
        totalTime: this.player.getDuration()
      };
      this.props.setSongInfo(songInfo);
    } else if (evt.data === YT.PlayerState.PAUSED) {
      this.props.updatePlayerStatus('paused');
    } else if (evt.data === YT.PlayerState.ENDED) {
      this.props.updatePlayerStatus('stopped');
      this.props.nextSong();
    }
  }

  public componentDidMount() {
    this.loadVideo();
  }

  public shouldComponentUpdate(nextProps: YouTubePlayerProps) {
    if (nextProps.nextStatus !== undefined) {
      return true;
    }

    if (
      Array.isArray(nextProps.currentQueue) &&
      Array.isArray(this.props.currentQueue) &&
      nextProps.currentQueue.length !== 0 &&
      nextProps.currentQueue.length === this.props.currentQueue.length &&
      nextProps.playerStatus === this.props.playerStatus &&
      nextProps.queueIndex === this.props.queueIndex
    ) {
      return false;
    }

    return true;
  }

  public componentWillUpdate(nextProps: YouTubePlayerProps) {
    if (nextProps.currentPlayList !== this.props.currentPlayList) {
      this.player = null;
    }
  }

  public componentDidUpdate() {
    if (
      this.props.nextStatus === 'loading' ||
      this.props.nextStatus === 'playing'
    ) {
      this.loadVideo();
    }

    if (this.player) {
      const ytPlayerState = this.player.getPlayerState();
      if (
        (this.props.nextStatus === 'resuming' &&
          ytPlayerState === YT.PlayerState.PAUSED) ||
        ytPlayerState === YT.PlayerState.ENDED
      ) {
        this.player.playVideo();
      } else if (
        this.props.nextStatus === 'paused' &&
        ytPlayerState === YT.PlayerState.PLAYING
      ) {
        this.player.pauseVideo();
      } else if (
        this.props.nextStatus === 'stopped' &&
        ytPlayerState === YT.PlayerState.PLAYING
      ) {
        this.player.stopVideo();
      }
    }
  }

  public render() {
    return <div id={YOUTUBE_PLAYER_DOM_ID} />;
  }
}

const mapStateToProps = (state: GlobalState) => ({
  currentPlayList: getCurrentPlayList(state),
  playerStatus: getPlayerStatus(state),
  currentQueue: getCurrentQueue(state),
  queueIndex: getQueueIndex(state),
  nextStatus: getNextPlayerStatus(state)
});

const mapDispatchToProps = (dispatch: Dispatch<undefined>) => ({
  updatePlayerStatus: (status: PlayerStatus) =>
    dispatch(changePlayerStatus(status)),
  updateQueueIndex: (index: number) => dispatch(setQueueIndex(index)),
  nextSong: () => dispatch(nextSong()),
  setSongInfo: (info: SongInfo) => dispatch(setSongInfo(info)),
  setProgress: (currentTime: number, totalTime: number, percentage: number) =>
    dispatch(setProgress(currentTime, totalTime, percentage))
});

export default connect(mapStateToProps, mapDispatchToProps)(YouTubePlayer);
