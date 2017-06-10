jest.mock('../YouTubePlayer');
jest.mock('../../actions/PlayerActions');
jest.mock('electron');

import * as React from 'react';
import { ipcRenderer } from 'electron';
import { shallow } from 'enzyme';
import * as renderer from 'react-test-renderer';

import { Player, PlayerProps, mapDispatchToProps } from '../Player';
import { PlayerProgressBarProps } from '../PlayerProgressBar';
import { PlayerButtonProps } from '../PlayerButton';
import { SongInfo } from '../../reducers/state-types';
import {
  addSong,
  nextSong,
  prevSong,
  loadPlaylist,
  togglePlayer
} from '../../actions/PlayerActions';

import { _ipcRendererEmitter } from '../../__mocks__/electron';

describe('test Player component', () => {
  let props: PlayerProps;

  beforeEach(() => {
    props = {
      currentSongInfo: undefined,
      playerStatus: undefined,
      togglePlayer: jest.fn(),
      nextSong: jest.fn(),
      prevSong: jest.fn(),
      loadPlaylist: jest.fn(),
      addSong: jest.fn()
    };

    (ipcRenderer.on as jest.Mock<any>).mockClear();
  });

  test('handles default', () => {
    const component = renderer.create(<Player {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(ipcRenderer.on).toHaveBeenCalledTimes(5);
  });

  test('handles click events', () => {
    const component = shallow(<Player {...props} />);
    const buttons = component.find('PlayerButton');
    expect(buttons).toHaveLength(3);
    const playButton = buttons.at(0);
    const prevButton = buttons.at(1);
    const nextButton = buttons.at(2);
    playButton.simulate('click');
    expect(props.togglePlayer).toHaveBeenCalledTimes(1);
    prevButton.simulate('click');
    expect(props.prevSong).toHaveBeenCalledTimes(1);
    nextButton.simulate('click');
    expect(props.nextSong).toHaveBeenCalledTimes(1);
  });

  test('display song info correct [snapshot]', () => {
    const songInfo: SongInfo = {
      title: 'My Unit Test',
      currentTime: 0,
      percentage: 0,
      totalTime: 10,
      videoId: 'someid'
    };
    props.currentSongInfo = songInfo;
    const component = renderer.create(<Player {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('display song info correct [components]', () => {
    const songInfo: SongInfo = {
      title: 'My Unit Test',
      currentTime: 3,
      percentage: 33.3,
      totalTime: 10,
      videoId: 'someid'
    };
    props.currentSongInfo = songInfo;
    const component = shallow(<Player {...props} />);

    // has the right progress and title
    const progressBar = component.find('PlayerProgressBar');
    const progressBarProps = progressBar.props() as PlayerProgressBarProps;
    expect(progressBarProps.percentage).toBe(33.3);
    expect(progressBarProps.title).toBe('My Unit Test');

    // has the right time
    const playerTimer = component.find('.timer').render();
    expect(playerTimer.text()).toBe('00:03');
  });

  test('display song info correct for longer time [components]', () => {
    const songInfo: SongInfo = {
      title: 'My Unit Test',
      currentTime: 3603,
      percentage: 33.3,
      totalTime: 10,
      videoId: 'someid'
    };
    props.currentSongInfo = songInfo;
    const component = shallow(<Player {...props} />);

    // has the right time
    const playerTimer = component.find('.timer').render();
    expect(playerTimer.text()).toBe('1:00:03');
  });

  test('changes the button label correctly for different player states', () => {
    const songInfo: SongInfo = {
      title: 'My Unit Test',
      currentTime: 3,
      percentage: 33.3,
      totalTime: 10,
      videoId: 'someid'
    };
    props.currentSongInfo = songInfo;
    props.playerStatus = 'stopped';
    const component = shallow(<Player {...props} />);

    // stopped player
    let playButton = component.find('PlayerButton').at(0);
    expect((playButton.props() as PlayerButtonProps).materialIcon).toBe(
      'play_arrow'
    );

    // playing player
    component.setProps({
      ...props,
      playerStatus: 'playing'
    });
    playButton = component.find('PlayerButton').at(0);
    expect((playButton.props() as PlayerButtonProps).materialIcon).toBe(
      'pause'
    );

    // loading player
    component.setProps({
      ...props,
      playerStatus: 'loading'
    });
    playButton = component.find('PlayerButton').at(0);
    expect((playButton.props() as PlayerButtonProps).materialIcon).toBe('loop');

    // paused player
    component.setProps({
      ...props,
      playerStatus: 'paused'
    });
    playButton = component.find('PlayerButton').at(0);
    expect((playButton.props() as PlayerButtonProps).materialIcon).toBe(
      'play_arrow'
    );
  });

  test('calls the right functions based on events', () => {
    const originalToggle = Player.prototype.togglePlayPause;
    Player.prototype.togglePlayPause = jest
      .fn()
      .mockImplementation(originalToggle);
    const originalPrev = Player.prototype.prevSong;
    Player.prototype.prevSong = jest.fn().mockImplementation(originalPrev);
    const originalNext = Player.prototype.nextSong;
    Player.prototype.nextSong = jest.fn().mockImplementation(originalNext);
    _ipcRendererEmitter.removeAllListeners();

    renderer.create(<Player {...props} />);

    _ipcRendererEmitter.emit('player:toggle');
    expect(Player.prototype.togglePlayPause).toHaveBeenCalledTimes(1);

    _ipcRendererEmitter.emit('player:prev');
    expect(Player.prototype.prevSong).toHaveBeenCalledTimes(1);

    _ipcRendererEmitter.emit('player:next');
    expect(Player.prototype.nextSong).toHaveBeenCalledTimes(1);

    _ipcRendererEmitter.emit('player:load:playlist');
    expect(props.loadPlaylist).toHaveBeenCalledTimes(1);

    _ipcRendererEmitter.emit('player:load:video');
    expect(props.addSong).toHaveBeenCalledTimes(1);

    Player.prototype.togglePlayPause = originalToggle;
    Player.prototype.prevSong = originalPrev;
    Player.prototype.nextSong = originalNext;
  });
});

describe('test mapDispatchToProps', () => {
  const dispatch = jest.fn(() => true);
  const map = mapDispatchToProps(dispatch);

  beforeEach(() => {
    dispatch.mockClear();
    (togglePlayer as jest.Mock<any>).mockClear();
    (nextSong as jest.Mock<any>).mockClear();
    (prevSong as jest.Mock<any>).mockClear();
    (loadPlaylist as jest.Mock<any>).mockClear();
    (addSong as jest.Mock<any>).mockClear();
  });

  test('dispatches togglePlayer correctly', () => {
    map.togglePlayer();
    expect(dispatch).toHaveBeenCalledWith({ type: 'TOGGLE_PLAYER' });
    expect(togglePlayer).toHaveBeenCalledTimes(1);
  });

  test('dispatches nextSong correctly', () => {
    map.nextSong();
    expect(dispatch).toHaveBeenCalledWith({ type: 'NEXT_SONG' });
    expect(nextSong).toHaveBeenCalledTimes(1);
  });

  test('dispatches prevSong correctly', () => {
    map.prevSong();
    expect(dispatch).toHaveBeenCalledWith({ type: 'PREV_SONG' });
    expect(prevSong).toHaveBeenCalledTimes(1);
  });

  test('dispatches loadPlaylist correctly', () => {
    map.loadPlaylist('playlistid');
    expect(dispatch).toHaveBeenCalledWith({
      type: 'LOAD_PLAYLIST',
      playlist: 'playlistid'
    });
    expect(loadPlaylist).toHaveBeenCalledWith('playlistid');
  });

  test('dispatches addSong correctly', () => {
    map.addSong('songid');
    expect(dispatch).toHaveBeenCalledWith({
      type: 'ADD_SONG',
      song: 'songid'
    });
    expect(addSong).toHaveBeenCalledWith('songid');
  });
});
