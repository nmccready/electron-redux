import createElectronReduxMiddlewares from '../createElectronReduxMiddlewares';
import forwardToMain from '../forwardToMain';
import forwardToRenderer from '../forwardToRenderer';

// import validateAction from '../../helpers/validateAction';

jest.unmock('../createElectronReduxMiddlewares');
jest.unmock('../forwardToMain');
jest.unmock('../forwardToRenderer');

let fakeWindow;
let fakeElectron;
let middleWare;

describe('createElectronReduxMiddlewares', () => {
  beforeEach(() => {
    fakeElectron = {
      ipcRenderer: {
        send: jest.fn(),
      },
      webContents: {
        getAllWebContents: jest.fn().mockReturnValue([]),
      },
    };

    fakeWindow = {
      ipcRenderer: {
        send: jest.fn(),
      },
      webContents: {
        getAllWebContents: jest.fn().mockReturnValue([]),
      },
    };

    middleWare = (_store, { ipcRenderer } = {}) => next => (action) => {
      const renderer = ipcRenderer || fakeElectron.ipcRenderer;
      renderer.send('junk', action);
      return next(action);
    };
  });

  it('should should use default dependencies', () => {
    const next = jest.fn();
    // thunk action
    const action = () => {};
    // validateAction.mockReturnValue(false);

    const [wrappedMiddleware] = createElectronReduxMiddlewares([middleWare]);

    wrappedMiddleware()(next)(action);

    expect(fakeElectron.ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should pass dependencies on to some middeware function', () => {
    const next = jest.fn();
    // thunk action
    const action = () => {};
    // validateAction.mockReturnValue(false);

    const [wrappedMiddleware] = createElectronReduxMiddlewares([middleWare], {
      dependencies: fakeWindow,
    });

    wrappedMiddleware()(next)(action);

    expect(fakeWindow.ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  describe('forwardToMain', () => {
    it('should use injected dependency', () => {
      const next = jest.fn();
      // thunk action
      const action = {
        type: 'crap',
        payload: {},
      };
      // validateAction.mockReturnValue(false);

      const [wrappedMiddleware] = createElectronReduxMiddlewares([forwardToMain], {
        dependencies: fakeWindow,
      });

      wrappedMiddleware()(next)(action);

      expect(fakeWindow.ipcRenderer.send).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalledWith(action);
    });
  });

  describe('forwardToRenderer', () => {
    it('should use injected dependency', () => {
      const next = jest.fn();
      // thunk action
      const action = {
        type: 'crap',
        payload: {},
      };
      // validateAction.mockReturnValue(false);

      const [wrappedMiddleware] = createElectronReduxMiddlewares([forwardToRenderer], {
        dependencies: fakeWindow,
      });

      wrappedMiddleware()(next)(action);

      expect(fakeWindow.webContents.getAllWebContents).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(action);
    });
  });
});
