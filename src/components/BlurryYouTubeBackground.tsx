import * as React from 'react';

export interface BlurryYouTubeBackgroundProps {
  videoId: string;
}

export default class BlurryYouTubeBackground extends React.Component<
  BlurryYouTubeBackgroundProps,
  undefined
> {
  public render() {
    if (this.props.videoId && this.props.videoId.length > 0) {
      const url = `https://img.youtube.com/vi/${this.props
        .videoId}/default.jpg`;
      return <img className="player-background blur-background" src={url} />;
    }

    return <img className="player-background blur-background" />;
  }
}
