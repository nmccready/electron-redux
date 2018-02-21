export default function replayActionRenderer(store, dependencies = {}) {
  const ipcRenderer = dependencies.ipcRenderer || require('electron').ipcRenderer;
  
  ipcRenderer.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
