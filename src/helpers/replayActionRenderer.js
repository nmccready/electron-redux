import hiddenRequire from './webpackHack';
import { get } from 'lodash';

export default function replayActionRenderer(store, dependencies = {}) {
  const ipcRenderer = dependencies.ipcRenderer || get(hiddenRequire('electron'), 'ipcRenderer');
  
  ipcRenderer.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
