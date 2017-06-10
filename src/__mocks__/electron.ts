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
