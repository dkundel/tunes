import * as React from 'react';
import PlayerProgressBar from '../PlayerProgressBar';
import * as renderer from 'react-test-renderer';

describe('test PlayerProgressBar component', () => {
  test('handles correct props', () => {
    const component = renderer.create(
      <PlayerProgressBar percentage={100} title="My Unit Test" />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
