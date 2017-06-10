import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ipcRenderer } from 'electron';
import * as moment from 'moment';
import styled from 'styled-components';

import {
  togglePlayer,
  nextSong,
  prevSong,
  loadPlaylist,
  addSong
} from '../actions/PlayerActions';
import { GlobalState, SongInfo, PlayerStatus } from '../reducers';
import { getCurrentSongInfo, getPlayerStatus } from '../reducers/player';

import BlurryYouTubeBackground from './BlurryYouTubeBackground';
import PlayerButton from './PlayerButton';
import PlayerProgressBar from './PlayerProgressBar';
import YouTubePlayer from './YouTubePlayer';

export interface PlayerProps {
  currentSongInfo: SongInfo | undefined;
  playerStatus: PlayerStatus;
  togglePlayer: () => any;
  nextSong: () => any;
  prevSong: () => any;
  loadPlaylist: (playlist: string) => any;
  addSong: (playlist: string) => any;
}

export class Player extends React.Component<PlayerProps, undefined> {
  constructor(props: PlayerProps) {
    super(props);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.prevSong = this.prevSong.bind(this);
  }

  public componentDidMount() {
    ipcRenderer.on('player:toggle', () => {
      this.togglePlayPause();
    });
    ipcRenderer.on('player:prev', () => {
      this.prevSong();
    });
    ipcRenderer.on('player:next', () => {
      this.nextSong();
    });
    ipcRenderer.on('player:load:playlist', (_: any, playlist: string) => {
      this.props.loadPlaylist(playlist);
    });
    ipcRenderer.on('player:load:video', (_: any, song: string) => {
      this.props.addSong(song);
    });
  }

  public togglePlayPause() {
    this.props.togglePlayer();
  }

  public nextSong() {
    this.props.nextSong();
  }

  public prevSong() {
    this.props.prevSong();
  }

  private getTimeString() {
    let timeInSeconds = this.props.currentSongInfo &&
      this.props.currentSongInfo.currentTime
      ? this.props.currentSongInfo.currentTime
      : 0;

    const format = timeInSeconds >= 60 * 60 ? 'H:mm:ss' : 'mm:ss';
    return moment({
      hours: 0,
      minutes: 0,
      seconds: 0
    })
      .seconds(timeInSeconds)
      .format(format);
  }

  private getPercentage(): number {
    if (!this.props.currentSongInfo) {
      return 0;
    }
    return this.props.currentSongInfo.percentage;
  }

  private getTitle(): string {
    if (!this.props.currentSongInfo) {
      return 'No video loaded';
    }

    return this.props.currentSongInfo.title;
  }

  private getPlayButtonIcon(): string {
    const { playerStatus } = this.props;
    if (playerStatus === 'playing') {
      return 'pause';
    }

    if (playerStatus === 'paused' || playerStatus === 'stopped') {
      return 'play_arrow';
    }

    if (playerStatus === 'loading') {
      return 'loop';
    }

    return 'play_arrow';
  }

  private getVideoId() {
    if (!this.props.currentSongInfo) {
      return '';
    }
    return this.props.currentSongInfo.videoId;
  }

  public render() {
    return (
      <PlayerContainer>
        <PlayerBar>
          <PlayerButtonGroup>
            <PlayerButton
              onClick={() => this.togglePlayPause()}
              materialIcon={this.getPlayButtonIcon()}
            />
            <PlayerButton
              onClick={() => this.prevSong()}
              materialIcon="skip_previous"
            />
            <PlayerButton
              onClick={() => this.nextSong()}
              materialIcon="skip_next"
            />
          </PlayerButtonGroup>
          <PlayerProgressBar
            percentage={this.getPercentage()}
            title={this.getTitle()}
          />
          <PlayerMetaBar>
            <PlayerTimer className="timer">
              {this.getTimeString()}
            </PlayerTimer>
          </PlayerMetaBar>
        </PlayerBar>
        <BlurryYouTubeBackground videoId={this.getVideoId()} />
        <YouTubePlayer />
      </PlayerContainer>
    );
  }
}

const PlayerContainer = styled.div`
  width: 100%;
`;

const PlayerBar = styled.div`
  display: flex;
  color: var(--colorPrimary);
  background: rgba(255, 255, 255, 0.3);
`;

const PlayerButtonGroup = styled.div``;

const PlayerMetaBar = styled.div`
  background: var(--colorPrimary);
  color: var(--colorSecondary);
`;

const PlayerTimer = styled.p`
  margin-left: 15px;
  margin-right: 15px;
`;

export const mapStateToProps = (state: GlobalState) => ({
  currentSongInfo: getCurrentSongInfo(state),
  playerStatus: getPlayerStatus(state)
});

export const mapDispatchToProps = (dispatch: Dispatch<undefined>) => ({
  togglePlayer: () => dispatch(togglePlayer()),
  nextSong: () => dispatch(nextSong()),
  prevSong: () => dispatch(prevSong()),
  loadPlaylist: (playlist: string) => dispatch(loadPlaylist(playlist)),
  addSong: (song: string) => dispatch(addSong(song))
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
