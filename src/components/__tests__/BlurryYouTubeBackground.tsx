import * as React from 'react';
import BlurryYouTubeBackground from '../BlurryYouTubeBackground';
import * as renderer from 'react-test-renderer';

describe('test BlurryYouTubeBackground component', () => {
  test('handles videoId correctly', () => {
    const component = renderer.create(
      <BlurryYouTubeBackground videoId="testid">
        Facebook
      </BlurryYouTubeBackground>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('handles empty videoId', () => {
    const component = renderer.create(
      <BlurryYouTubeBackground videoId="">
        Facebook
      </BlurryYouTubeBackground>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
