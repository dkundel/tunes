import { globalShortcut, clipboard, ipcMain } from 'electron';
import * as menubar from 'menubar';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import { parse } from 'url';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// let mainWindow: Electron.BrowserWindow | null = null;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

let isVisible = false;

const mb = menubar({
  index: `file://${__dirname}/index.html`,
  width: 650,
  height: 50,
  preloadWindow: true,
  alwaysOnTop: true,
  tooltip: '🎵 Toggle Tunes',
  resizable: !!isDevMode
});

const { app } = mb;

mb.on('ready', async () => {
  registerHandlers();
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    await installExtension(REDUX_DEVTOOLS);
  }
});

mb.on('after-show', () => {
  isVisible = true;
});

mb.on('after-hide', () => {
  isVisible = false;
});

mb.on('after-create-window', () => {
  if (isDevMode) {
    mb.window.webContents.openDevTools();
  }
});

app.on('before-quit', () => {
  globalShortcut.unregisterAll();
});

function registerHandlers() {
  const web = mb.window.webContents;
  globalShortcut.register('CmdOrCtrl+Shift+U', () => {
    if (isVisible) {
      mb.hideWindow();
    } else {
      mb.showWindow();
    }
  });

  globalShortcut.register('MediaPlayPause', () => {
    web.send('player:toggle');
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    web.send('player:prev');
  });

  globalShortcut.register('MediaNextTrack', () => {
    web.send('player:next');
  });

  globalShortcut.register('CmdOrCtrl+Shift+Y', () => {
    let ytUrl = parse(clipboard.readText(), true);
    if (ytUrl && ytUrl.query) {
      if (ytUrl.query.list) {
        web.send('player:load:playlist', ytUrl.query.list);
      } else if (ytUrl.query.v) {
        web.send('player:load:video', ytUrl.query.v);
      }
    }
  });
}
