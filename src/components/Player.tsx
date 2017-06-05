import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as moment from 'moment';

import { togglePlayer } from '../actions';
import { GlobalState, SongInfo, CurrentPlayerStatus } from '../reducers';
import { getCurrentSongInfo, getPlayerStatus } from '../reducers/player';

import BlurryYouTubeBackground from './BlurryYouTubeBackground';
import PlayerButton from './PlayerButton';
import PlayerProgressBar from './PlayerProgressBar';

export interface PlayerProps {
  currentSongInfo: SongInfo;
  playerStatus: CurrentPlayerStatus;
}

class Player extends React.Component<PlayerProps, undefined> {
  constructor(props: PlayerProps) {
    super(props);
    this.togglePlayPause = this.togglePlayPause.bind(this);
  }

  private togglePlayPause() {
    console.log('Play/Pause');
  }

  private hasSongInfo(): boolean {
    return !!this.props.currentSongInfo;
  }

  private getTimeString() {
    let timeInSeconds = this.hasSongInfo() &&
      this.props.currentSongInfo.currentTime
      ? this.props.currentSongInfo.currentTime
      : 0;
    return moment({ seconds: timeInSeconds }).format('mm:ss');
  }

  private getPercentage(): number {
    if (!this.hasSongInfo()) {
      return 0;
    }
    return this.props.currentSongInfo.percentage;
  }

  private getTitle(): string {
    if (!this.hasSongInfo()) {
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
    if (!this.hasSongInfo()) {
      return '';
    }
    return this.props.currentSongInfo.videoId;
  }

  public render() {
    return (
      <div className="player">
        <div className="player-bar">
          <div className="player-buttonGroup">
            <PlayerButton
              onClick={() => this.togglePlayPause()}
              materialIcon={this.getPlayButtonIcon()}
            />
            <PlayerButton materialIcon="skip_previous" />
            <PlayerButton materialIcon="skip_next" />
          </div>
          <PlayerProgressBar
            percentage={this.getPercentage()}
            title={this.getTitle()}
          />
          <div className="player-metabar">
            <p className="player-time">
              {this.getTimeString()}
            </p>
          </div>
        </div>
        <BlurryYouTubeBackground videoId={this.getVideoId()} />
        <div id="youtubePlayer" />
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  currentSongInfo: getCurrentSongInfo(state),
  playerStatus: getPlayerStatus(state)
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
