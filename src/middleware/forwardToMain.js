import { get } from 'lodash';
import validateAction from '../helpers/validateAction';
import hiddenRequire from '../helpers/webpackHack';

const noop = () => undefined;

const forwardToMain = (store, dependencies = {}) => next => (action) => {
  // eslint-disable-line no-unused-vars
  const ipcRenderer = dependencies.ipcRenderer ||
    get(hiddenRequire('electron'),  'ipcRenderer');
    
  
  const doValidateAction = dependencies.doValidateAction != null ? dependencies.doValidateAction : true;

  const debug = dependencies.debug || noop;

  if (doValidateAction && !validateAction(action)) {
    debug(()=> "invalid action, skipping");
    return next(action)
  };

  if (
    action.type.substr(0, 2) !== '@@' &&
    action.type.substr(0, 10) !== 'redux-form' &&
    (!action.meta || !action.meta.scope || action.meta.scope !== 'local')
  ) {
    debug(()=> `sending: redux-action type ${action.type}`);
    ipcRenderer.send('redux-action', action);

    // stop action in-flight
    // eslint-disable-next-line consistent-return
    return;
  }

  // eslint-disable-next-line consistent-return
  return next(action);
};

export default forwardToMain;
