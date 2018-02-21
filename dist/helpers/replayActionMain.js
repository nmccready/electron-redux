"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replayActionMain;

var _webpackHack = _interopRequireDefault(require("./webpackHack"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function replayActionMain(store) {
  var dependencies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var ipcMain = dependencies.ipcMain || (0, _lodash.get)((0, _webpackHack.default)('electron'), 'ipcMain');
  /**
   * Give renderers a way to sync the current state of the store, but be sure
   * we don't expose any remote objects. In other words, we need our state to
   * be serializable.
   *
   * Refer to https://github.com/electron/electron/blob/master/docs/api/remote.md#remote-objects
   */

  global.getReduxState = function () {
    return JSON.stringify(store.getState());
  };

  ipcMain.on('redux-action', function (event, payload) {
    store.dispatch(payload);
  });
}