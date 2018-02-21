const createElectronReduxMiddlewares = (middlewares, { dependencies } = {}) =>
  middlewares.map(origFunc => _store => origFunc(_store, dependencies));

export default createElectronReduxMiddlewares;
