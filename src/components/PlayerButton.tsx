import * as React from 'react';
import styled from 'styled-components';

export interface PlayerButtonProps {
  onClick?: Function;
  materialIcon: string;
}

const StyledButton = styled.button`
  width: 40px;
  height: 51px;
  border: 0;
  outline: 0;
  cursor: pointer;
  background: var(--colorPrimary);
  color: var(--colorSecondary);
  &:hover {
    background: var(--colorPrimaryHover);
  }
`;

export default class PlayerButton extends React.Component<
  PlayerButtonProps,
  undefined
> {
  public render() {
    return (
      <StyledButton onClick={() => this.props.onClick && this.props.onClick()}>
        <i className="material-icons">
          {this.props.materialIcon || 'help_outline'}
        </i>
      </StyledButton>
    );
  }
}
