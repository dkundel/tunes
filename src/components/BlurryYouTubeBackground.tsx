import * as React from 'react';
import styled from 'styled-components';

export interface BlurryYouTubeBackgroundProps {
  videoId: string;
}

const StyledImage = styled.img`
  width: 100%;
  position: absolute;
  z-index: -1;
  top: 0;
  transform: translateY(-50%);
  filter: blur(15px);
  -webkit-filter: blur(15px);
`;

export default class BlurryYouTubeBackground extends React.Component<
  BlurryYouTubeBackgroundProps,
  undefined
> {
  public render() {
    if (this.props.videoId && this.props.videoId.length > 0) {
      const url = `https://img.youtube.com/vi/${this.props
        .videoId}/default.jpg`;
      return (
        <StyledImage className="player-background blur-background" src={url} />
      );
    }

    return <StyledImage className="player-background blur-background" />;
  }
}
