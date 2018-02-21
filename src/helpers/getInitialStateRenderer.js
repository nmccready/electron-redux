export default function getInitialStateRenderer(dependencies = {}) {
  const remote = dependencies.remote || require('electron').remote;

  const getReduxState = remote.getGlobal('getReduxState');
  if (!getReduxState) {
    throw new Error(
      'Could not find reduxState global in main process, did you forget to call replayActionMain?'
    );
  }
  return JSON.parse(getReduxState());
}
