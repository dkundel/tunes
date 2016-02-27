import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as electron from 'electron';
import * as url from 'url';
import * as moment from 'moment';
import { YouTubePlayer, YouTubeTimeUpdate }  from '../youtube-control';

const { app, globalShortcut, clipboard } = electron.remote;

const PLAY_ICON = 'play_arrow';
const PAUSE_ICON = 'pause';

function registerHandlers() {

}

export interface IPlayerProps {

}

export interface IPlayerState {
  progressBar?: React.CSSProperties,
  titleOverlay?: React.CSSProperties,
  currentTime?: string,
  info?: string,
  backgroundImage?: string,
  playIcon?: string
}

export default class Player extends React.Component<IPlayerProps, IPlayerState> {
  public componentDidMount() {
    this.registerHandlers();
    this.player = new YouTubePlayer('youtubePlayer', {
      onTimeUpdate: (e) => this.onProgress(e),
      onVideoLoaded: (e) => this.onNewVideo(e),
      onPlayPause: (e) => this.onPlayPause(e)
    });
    this.progressBar = ReactDOM.findDOMNode(this.refs['progressBar']) as HTMLElement;
    this.titleOverlay = ReactDOM.findDOMNode(this.refs['titleOverlay']) as HTMLElement;
    this.progressContainer = ReactDOM.findDOMNode(this.refs['progressContainer']) as HTMLElement;
    this.progressBarWidth = this.progressBar.getBoundingClientRect().width;
    this.resetProgress();
  }

  public render() {
    return (
      <div className="player">
        <div className="player-bar">
          <div className="player-buttonGroup">
            <button onClick={(e) => this.togglePlay()} className="player-button player-button--primary">
              <i className="material-icons">{this.state.playIcon}</i>
            </button>
            <button onClick={(e) => this.pressPrev()} className="player-button player-button--primary">
              <i className="material-icons">skip_previous</i>
            </button>
            <button onClick={(e) => this.pressNext()} className="player-button player-button--primary">
              <i className="material-icons">skip_next</i>
            </button>
          </div>
          <div className="player-progress" ref="progressContainer" onClick={(e) => this.moveTrack(e)}>
            <p className="player-title">{this.state.info}</p>
            <div className="player-progress-bar" ref="progressBar" style={this.state.progressBar}></div>
            <div className="player-title-overlay" ref="titleOverlay" style={this.state.titleOverlay}>
              <p className="player-title-overlay-content">{this.state.info}</p>
            </div>
          </div>
          <div className="player-metabar">
            <p className="player-time">{this.state.currentTime}</p>
          </div>
        </div>
        <img className="player-background blur-background" src={this.state.backgroundImage}/>
        <div id="youtubePlayer"></div>
      </div>
    );
  }

  public state: IPlayerState = {
    backgroundImage: '',
    currentTime: '00:00',
    playIcon: PLAY_ICON
  };

  private setPercent(percent: number) {
    this.progressBarWidth = this.progressBar.getBoundingClientRect().width;
    let width = this.progressBarWidth * (percent/100.0);
    let shift = this.progressBarWidth - width;
    this.progressBar.style.transform = `translateX(-${shift.toFixed(2)}px)`;
    this.progressBar.style.webkitTransform = `translateX(-${shift.toFixed(2)}px)`;
    this.titleOverlay.style.width = `${width.toFixed(2)}px`;
  }

  private resetProgress() {
    let width = this.progressBarWidth.toFixed(2);
    this.progressBar.style.transform = `translateX(-${width}px)`;
    this.progressBar.style.webkitTransform = `translateX(-${width}px)`;
    this.titleOverlay.style.width = `0px`;
  }

  public togglePlay() {
    if (this.player) {
      this.player.playPause();
    }
  }

  public pressNext() {
    if (this.player) {
      this.player.next();
    }
  }

  public pressPrev() {
    if (this.player) {
      this.player.prev();
    }
  }

  public moveTrack(e: React.MouseEvent) {
    let left = this.progressContainer.getBoundingClientRect().left;
    let width = this.progressContainer.getBoundingClientRect().width;

    let relativePos = e.pageX - left;
    let percent = relativePos / width;
    this.player.moveToPercentage(percent);
  }

  private onPlayPause(state: YT.PlayerState) {
    if (state === YT.PlayerState.PLAYING) {
      this.setState({playIcon: PAUSE_ICON});
      return;
    }

    if (state === YT.PlayerState.PAUSED) {
      this.setState({playIcon: PLAY_ICON});
      return;
    }
  }

  private onProgress(e: YouTubeTimeUpdate) {
    let { currentTime, totalTime } = e;
    let percent = (currentTime / totalTime) * 100.0;
    let seconds = Math.round(currentTime % 60.0);
    let minutes = Math.floor(currentTime / 60.0);
    this.setPercent(percent);
    let time = moment({m: minutes, s: seconds});
    this.setState({ currentTime: time.format('mm:ss') });
  }

  private onNewVideo(e: YT.VideoData) {
    let { author, title, video_id } = e;
    this.resetProgress();
    this.setState({ info: `${title} - ${author}`});
    this.setState({ backgroundImage: `http://img.youtube.com/vi/${video_id}/maxresdefault.jpg`});
  }

  private registerHandlers() {
    globalShortcut.register('MediaPlayPause', () => {
      if (this.player) {
        this.player.playPause();
      }
    });

    globalShortcut.register('MediaPreviousTrack', () => {
      if (this.player) {
        this.player.prev();
      }
    });

    globalShortcut.register('MediaNextTrack', () => {
      if (this.player) {
        this.player.next();
      }
    });

    globalShortcut.register('CmdOrCtrl+Shift+Y', () => {
      if (!this.player) return;

      let ytUrl = url.parse(clipboard.readText(), true);
      if (ytUrl && ytUrl.query) {
        if (ytUrl.query.list) {
          this.player.load(ytUrl.query.list, true);
        } else if (ytUrl.query.v) {
          this.player.load(ytUrl.query.v);
        }
      }
    });
  }

  private unregisterHandlers() {
    globalShortcut.unregister('MediaPlayPause');
    globalShortcut.unregister('MediaPreviousTrack');
    globalShortcut.unregister('MediaNextTrack');
    globalShortcut.unregister('CmdOrCtrl+Shift+Y');
  }

  private player: YouTubePlayer;
  private progressBar: HTMLElement;
  private progressContainer: HTMLElement;
  private titleOverlay: HTMLElement;
  private progressBarWidth: number;
}