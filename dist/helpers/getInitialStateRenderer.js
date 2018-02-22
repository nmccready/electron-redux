"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getInitialStateRenderer;

var _webpackHack = _interopRequireDefault(require("./webpackHack"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getInitialStateRenderer() {
  var dependencies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var remote = dependencies.remote || (0, _lodash.get)((0, _webpackHack.default)('electron'), 'remote');
  var getReduxState = remote.getGlobal('getReduxState');

  if (!getReduxState) {
    throw new Error('Could not find reduxState global in main process, did you forget to call replayActionMain?');
  }

  return JSON.parse(getReduxState());
}