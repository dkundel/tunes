jest.mock('electron');

import * as React from 'react';
import About from '../About';
import { shallow } from 'enzyme';
import * as renderer from 'react-test-renderer';

import { remote } from 'electron';

describe('test About component', () => {
  test('verify snapshot', () => {
    const component = renderer.create(<About />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('closes window on button press', () => {
    const component = shallow(<About />);
    component.find('#closeAbout').simulate('click');
    expect(remote.getCurrentWindow().close).toHaveBeenCalledTimes(1);
  });
});
