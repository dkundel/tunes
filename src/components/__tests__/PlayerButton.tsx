import * as React from 'react';
import PlayerButton from '../PlayerButton';
import { shallow } from 'enzyme';
import * as renderer from 'react-test-renderer';

describe('test PlayerButton component', () => {
  test('handles materialIcon correctly', () => {
    const component = renderer.create(<PlayerButton materialIcon="search" />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('handles empty materialIcon correctly', () => {
    const component = renderer.create(<PlayerButton materialIcon="" />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('handles onClick event correct', () => {
    const click = jest.fn();
    const component = shallow(
      <PlayerButton
        materialIcon="search"
        onClick={(...args: any[]) => click(args)}
      />
    );

    expect(component.children().text()).toBe('search');
    component.simulate('click');
    expect(click).toHaveBeenCalledTimes(1);
  });
});
