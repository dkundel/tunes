import * as React from 'react';

export interface PlayerProgressBarProps {
  percentage: number;
  title: string;
}

export default class PlayerProgressBar extends React.Component<
  PlayerProgressBarProps,
  undefined
> {
  public render() {
    return (
      <div className="player-progress" ref="progressContainer">
        <p className="player-title">{this.props.title}</p>
        <div
          className="player-progress-bar"
          ref="progressBar"
          style={{ '--percentage': this.props.percentage + '%' }}
        />
        <div
          className="player-title-overlay"
          ref="titleOverlay"
          style={{ '--percentage': this.props.percentage + '%' }}
        >
          <p className="player-title-overlay-content">
            {this.props.title}
          </p>
        </div>
      </div>
    );
  }
}
