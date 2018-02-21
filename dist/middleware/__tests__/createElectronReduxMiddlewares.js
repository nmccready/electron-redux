"use strict";

var _createElectronReduxMiddlewares = _interopRequireDefault(require("../createElectronReduxMiddlewares"));

var _forwardToMain = _interopRequireDefault(require("../forwardToMain"));

var _forwardToRenderer = _interopRequireDefault(require("../forwardToRenderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

// import validateAction from '../../helpers/validateAction';
jest.unmock('../createElectronReduxMiddlewares');
jest.unmock('../forwardToMain');
jest.unmock('../forwardToRenderer');
var fakeWindow;
var fakeElectron;
var middleWare;
describe('createElectronReduxMiddlewares', function () {
  beforeEach(function () {
    fakeElectron = {
      ipcRenderer: {
        send: jest.fn()
      },
      webContents: {
        getAllWebContents: jest.fn().mockReturnValue([])
      }
    };
    fakeWindow = {
      ipcRenderer: {
        send: jest.fn()
      },
      webContents: {
        getAllWebContents: jest.fn().mockReturnValue([])
      }
    };

    middleWare = function middleWare(_store) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          ipcRenderer = _ref.ipcRenderer;

      return function (next) {
        return function (action) {
          var renderer = ipcRenderer || fakeElectron.ipcRenderer;
          renderer.send('junk', action);
          return next(action);
        };
      };
    };
  });
  it('should should use default dependencies', function () {
    var next = jest.fn(); // thunk action

    var action = function action() {}; // validateAction.mockReturnValue(false);


    var _createElectronReduxM = (0, _createElectronReduxMiddlewares.default)([middleWare]),
        _createElectronReduxM2 = _slicedToArray(_createElectronReduxM, 1),
        wrappedMiddleware = _createElectronReduxM2[0];

    wrappedMiddleware()(next)(action);
    expect(fakeElectron.ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
  it('should pass dependencies on to some middeware function', function () {
    var next = jest.fn(); // thunk action

    var action = function action() {}; // validateAction.mockReturnValue(false);


    var _createElectronReduxM3 = (0, _createElectronReduxMiddlewares.default)([middleWare], {
      dependencies: fakeWindow
    }),
        _createElectronReduxM4 = _slicedToArray(_createElectronReduxM3, 1),
        wrappedMiddleware = _createElectronReduxM4[0];

    wrappedMiddleware()(next)(action);
    expect(fakeWindow.ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
  describe('forwardToMain', function () {
    it('should use injected dependency', function () {
      var next = jest.fn(); // thunk action

      var action = {
        type: 'crap',
        payload: {}
      }; // validateAction.mockReturnValue(false);

      var _createElectronReduxM5 = (0, _createElectronReduxMiddlewares.default)([_forwardToMain.default], {
        dependencies: fakeWindow
      }),
          _createElectronReduxM6 = _slicedToArray(_createElectronReduxM5, 1),
          wrappedMiddleware = _createElectronReduxM6[0];

      wrappedMiddleware()(next)(action);
      expect(fakeWindow.ipcRenderer.send).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalledWith(action);
    });
  });
  describe('forwardToRenderer', function () {
    it('should use injected dependency', function () {
      var next = jest.fn(); // thunk action

      var action = {
        type: 'crap',
        payload: {}
      }; // validateAction.mockReturnValue(false);

      var _createElectronReduxM7 = (0, _createElectronReduxMiddlewares.default)([_forwardToRenderer.default], {
        dependencies: fakeWindow
      }),
          _createElectronReduxM8 = _slicedToArray(_createElectronReduxM7, 1),
          wrappedMiddleware = _createElectronReduxM8[0];

      wrappedMiddleware()(next)(action);
      expect(fakeWindow.webContents.getAllWebContents).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(action);
    });
  });
});