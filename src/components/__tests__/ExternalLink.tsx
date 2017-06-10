jest.mock('electron');

import * as React from 'react';
import ExternalLink from '../ExternalLink';
import { shallow } from 'enzyme';
import * as renderer from 'react-test-renderer';
import { shell } from 'electron';

describe('test ExternalLink component', () => {
  beforeEach(() => {
    (shell.openExternal as jest.Mock<any>).mockClear();
  });

  test('verify snapshot', () => {
    const component = renderer.create(
      <ExternalLink href="https://foo.bar">Hey</ExternalLink>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('triggers shell', () => {
    const component = shallow(
      <ExternalLink href="https://foo.bar">
        Hey
      </ExternalLink>
    );
    const mockEvent = { preventDefault: jest.fn() };
    component.simulate('click', mockEvent);
    expect(shell.openExternal).toHaveBeenCalledWith('https://foo.bar');
    expect(shell.openExternal).toHaveBeenCalledTimes(1);
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
  });
});
