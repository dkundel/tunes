/// <reference path="../typings/tsd.d.ts" />

const menubar = require('menubar');

import { globalShortcut } from 'electron';
import * as youtube from './youtube-control';

let mb = menubar({
  'always-on-top': true,
  'preload-window': true,
  'tooltip': 'My player',
  'dir': 'out',
  'width': 650,
  'height': 50,
  'resizeable': false
});

let visible = false;

mb.on('ready', () => {
  console.log('ready');
  globalShortcut.register('CmdOrCtrl+Shift+U', () => {
    if (visible) {
      mb.hideWindow();
    } else {
      mb.showWindow();
    }
  });
});

mb.on('after-show', () => {
  visible = true;
});

mb.on('after-hide', () => {
  visible = false;
});

mb.on('after-create-window', () => {
  // (<any> mb.window).onYouTubeIframeAPIReady = () => {
  //   youtube.createPlayer();
  // }
  mb.window.openDevTools();
});