import { get } from 'lodash';
import validateAction from '../helpers/validateAction';
import hiddenRequire from '../helpers/webpackHack';

const noop = () => undefined;


const forwardToRenderer = (store, dependencies = {}) => next => (action) => {
  // eslint-disable-line no-unused-vars
  const webContents = dependencies.webContents || get(hiddenRequire('electron'), 'webContents');
  const doValidateAction = dependencies.doValidateAction != null ? dependencies.doValidateAction : true;
  const debug = dependencies.debug || noop;

  if ((!action || !action.type) || (doValidateAction && !validateAction(action)))) {
    debug(()=> "invalid action, skipping");
    return next(action)
  };
  
  if (action.meta && action.meta.scope === 'local') {
    debug(()=> "meta: local action, skipping");
    return next(action)
  };

  // change scope to avoid endless-loop
  const rendererAction = {
    ...action,
    meta: {
      ...action.meta,
      scope: 'local',
    },
  };

  const allWebContents = webContents.getAllWebContents();
  debug(()=>allWebContents);

  allWebContents.forEach((contents) => {
    debug(()=> `forwardToRenderer: sending: redux-action type ${action.type}`);
    contents.send('redux-action', rendererAction);
  });

  return next(action);
};

export default forwardToRenderer;
