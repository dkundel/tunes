import * as React from 'react';
import MaterialIcon from '../MaterialIcon';
import * as renderer from 'react-test-renderer';

describe('test MaterialIcon component', () => {
  test('verify snapshot', () => {
    const component = renderer.create(<MaterialIcon icon="close" />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
