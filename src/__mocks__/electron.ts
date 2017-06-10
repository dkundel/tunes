import EventEmitter = require('events');

export class MockIpcRenderer extends EventEmitter {}

export const _ipcRendererEmitter = new MockIpcRenderer();

export const ipcRenderer = {
  send: jest.fn(),
  on: jest.fn((evt: string, callback: Function) =>
    _ipcRendererEmitter.on(evt, callback)
  )
};

export const shell = {
  openExternal: jest.fn()
};

export const window = {
  close: jest.fn()
};

export const app = {
  getVersion: jest.fn(() => '1.0.0')
};

export const remote = {
  app,
  getCurrentWindow: () => {
    return window;
  }
};
