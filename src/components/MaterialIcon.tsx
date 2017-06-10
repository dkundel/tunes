import * as React from 'react';

export interface MaterialIconProps {
  icon: string;
}

export default class PlayerButton extends React.Component<
  MaterialIconProps,
  undefined
> {
  public render() {
    return (
      <i className="material-icons">
        {this.props.icon}
      </i>
    );
  }
}
