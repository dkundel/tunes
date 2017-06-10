import {
  globalShortcut,
  clipboard,
  ipcMain,
  Menu,
  MenuItem,
  BrowserWindow
} from 'electron';
import * as menubar from 'menubar';
import * as path from 'path';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import { parse } from 'url';
import * as Config from 'electron-config';

import DefaultConfig from './config/default';

const isDevMode = process.execPath.match(/[\\/]electron/);
const config = new Config({ defaults: DefaultConfig });

const PLAYING_ICON = path.join(__dirname, 'icon-active.png');
const DEFAULT_ICON = path.join(__dirname, 'icon.png');

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

let isVisible = false;

const mb = menubar({
  index: `file://${__dirname}/index.html`,
  width: 650,
  height: 50,
  preloadWindow: true,
  alwaysOnTop: true,
  tooltip: '🎵 Toggle Tunes',
  resizable: !!isDevMode,
  icon: DEFAULT_ICON
});

const { app } = mb;

mb.on('ready', async () => {
  const contextMenu = getContextMenu();
  mb.tray.on('click', (evt: any) => {
    if (evt.altKey) {
      mb.tray.popUpContextMenu(contextMenu);
    }
  });
  mb.tray.on('right-click', () => {
    mb.tray.popUpContextMenu(contextMenu);
  });

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
  const showHideShortcut = config.get('shortcuts.showHide');
  const playPauseShortcut = config.get('shortcuts.playPause');
  const nextShortcut = config.get('shortcuts.next');
  const prevShortcut = config.get('shortcuts.prev');
  const loadShortcut = config.get('shortcuts.load');
  globalShortcut.register(showHideShortcut, () => {
    if (isVisible) {
      mb.hideWindow();
    } else {
      mb.showWindow();
    }
  });

  globalShortcut.register(playPauseShortcut, () => {
    web.send('player:toggle');
  });

  globalShortcut.register(prevShortcut, () => {
    web.send('player:prev');
  });

  globalShortcut.register(nextShortcut, () => {
    web.send('player:next');
  });

  globalShortcut.register(loadShortcut, () => {
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

type IconType = 'playing' | 'default';

ipcMain.on('tray:icon', (_: any, iconType: IconType) => {
  const pathToIcon = iconType === 'playing' ? PLAYING_ICON : DEFAULT_ICON;
  mb.tray.setImage(pathToIcon);
});

function getContextMenu() {
  const separator = new MenuItem({ type: 'separator' });
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: 'About 🎵 tunes',
      click: openAbout
    })
  );
  menu.append(separator);
  menu.append(
    new MenuItem({
      label: 'Active Global Keybindings',
      type: 'checkbox',
      checked: true,
      click(item: Electron.MenuItem) {
        if (!item.checked) {
          globalShortcut.unregisterAll();
        } else {
          registerHandlers();
        }
      }
    })
  );
  menu.append(separator);
  menu.append(new MenuItem({ role: 'quit', label: 'Quit 🎵 tunes' }));
  return menu;
}

let aboutWindow: Electron.BrowserWindow | null;
function openAbout() {
  if (aboutWindow) {
    aboutWindow.show();
    return;
  }

  aboutWindow = new BrowserWindow({ frame: false, width: 500, height: 500 });
  aboutWindow.loadURL(`file://${__dirname}/about.html`);

  aboutWindow.on('close', () => {
    aboutWindow = null;
  });
}
