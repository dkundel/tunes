/// <reference path="../typings/tsd.d.ts" />
import * as url from 'url';
import * as electron from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Player from './components/player';

const { app, globalShortcut, clipboard } = electron.remote;

window['onYouTubeIframeAPIReady'] = () => {
  ReactDOM.render(
    <Player />,
    document.getElementById('test')
  );

  app.on('ready', () => {
    globalShortcut.unregisterAll();
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
}