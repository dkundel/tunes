import * as React from 'react';
import styled, { css } from 'styled-components';

export interface PlayerProgressBarProps {
  percentage: number;
  title: string;
}

const ProgressContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const playerTitleBaseStyles = css`
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const stretch = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all linear 1s;
`;

const PlayerTitle = styled.p`${playerTitleBaseStyles}`;
const PlayerOverlayContent = styled.p`${playerTitleBaseStyles}`;
const ProgressBar = styled.div`
  ${stretch}
  background: var(--colorPrimary);
  --transformX: calc(-1 * (100% - var(--percentage, 100%)));
  transform: translateX(var(--transformX));
`;
const ProgressBarOverlay = styled.div`
  ${stretch}
  color: var(--colorSecondary);
  overflow: hidden;
  white-space: nowrap;
  width: calc(var(--percentage, 100%));
`;

export default class PlayerProgressBar extends React.Component<
  PlayerProgressBarProps,
  undefined
> {
  public render() {
    return (
      <ProgressContainer>
        <PlayerTitle>{this.props.title}</PlayerTitle>
        <ProgressBar style={{ '--percentage': this.props.percentage + '%' }} />
        <ProgressBarOverlay
          style={{ '--percentage': this.props.percentage + '%' }}
        >
          <PlayerOverlayContent>
            {this.props.title}
          </PlayerOverlayContent>
        </ProgressBarOverlay>
      </ProgressContainer>
    );
  }
}
