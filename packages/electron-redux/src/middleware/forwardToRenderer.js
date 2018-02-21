import { webContents as elecWebContents } from 'electron';
import validateAction from '../helpers/validateAction';

const forwardToRenderer = (store, dependencies = {}) => next => (action) => {
  // eslint-disable-line no-unused-vars
  const webContents = dependencies.webContents || elecWebContents;

  if (!validateAction(action)) return next(action);
  if (action.meta && action.meta.scope === 'local') return next(action);

  // change scope to avoid endless-loop
  const rendererAction = {
    ...action,
    meta: {
      ...action.meta,
      scope: 'local',
    },
  };

  const allWebContents = webContents.getAllWebContents();

  allWebContents.forEach((contents) => {
    contents.send('redux-action', rendererAction);
  });

  return next(action);
};

export default forwardToRenderer;
