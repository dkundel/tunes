import * as React from 'react';

export interface PlayerButtonProps {
  onClick?: Function;
  materialIcon: string;
}

export default class PlayerButton extends React.Component<
  PlayerButtonProps,
  undefined
> {
  public render() {
    return (
      <button
        onClick={() => this.props.onClick && this.props.onClick()}
        className="player-button player-button--primary"
      >
        <i className="material-icons">
          {this.props.materialIcon || 'help_outline'}
        </i>
      </button>
    );
  }
}
