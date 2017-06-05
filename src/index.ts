import { globalShortcut } from 'electron';
import * as menubar from 'menubar';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

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

mb.on('ready', () => {
  console.log(`Let's go!`);

  globalShortcut.register('CmdOrCtrl+Shift+U', () => {
    if (isVisible) {
      mb.hideWindow();
    } else {
      mb.showWindow();
    }
  });
});

mb.on('after-show', () => {
  isVisible = true;
});

mb.on('after-hide', () => {
  isVisible = false;
});

mb.on('after-create-window', async () => {
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mb.window.webContents.openDevTools();
  }
});

app.on('before-quit', () => {
  globalShortcut.unregisterAll();
});
