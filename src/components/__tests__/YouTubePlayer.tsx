type MockPlayerOptions = {
  events: {
    onReady: Function;
    onStateChange: Function;
    onError: Function;
  };
};

class MockPlayer {
  constructor(private domId: string, private opts: MockPlayerOptions) {}
  playVideoAt(): void {}
  getCurrentTime(): void {}
  getDuration(): void {}
  playVideo(): void {}
  getPlaylistIndex(): void {}
  getVideoData(): void {}
  getPlayerState(): void {}
  _triggerOnReady(): void {
    this.opts.events.onReady({ target: this });
  }
  _triggerOnStateChange(data: number) {
    this.opts.events.onStateChange({ data });
  }
  _triggerOnError(err: any) {
    this.opts.events.onError(err);
  }
}

MockPlayer.prototype.playVideoAt = jest.fn();
MockPlayer.prototype.getCurrentTime = jest.fn();
MockPlayer.prototype.getDuration = jest.fn();
MockPlayer.prototype.playVideo = jest.fn();
MockPlayer.prototype.getPlaylistIndex = jest.fn();
MockPlayer.prototype.getVideoData = jest.fn();
MockPlayer.prototype.getPlayerState = jest.fn();

global['YT'] = {
  Player: MockPlayer
};

import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { YouTubePlayer, YouTubePlayerProps } from '../YouTubePlayer';

describe('test Player component', () => {
  let props: YouTubePlayerProps;

  beforeEach(() => {
    props = {
      currentPlaylist: undefined,
      currentQueue: [],
      nextSong: jest.fn(),
      nextStatus: undefined,
      playerStatus: 'stopped',
      queueIndex: 0,
      setProgress: jest.fn(),
      setSongInfo: jest.fn(),
      updatePlayerStatus: jest.fn(),
      updateQueueIndex: jest.fn()
    };
  });

  test('handles default', () => {
    const component = renderer.create(<YouTubePlayer {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
