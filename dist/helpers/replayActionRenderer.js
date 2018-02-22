"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replayActionRenderer;

var _webpackHack = _interopRequireDefault(require("./webpackHack"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function replayActionRenderer(store) {
  var dependencies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var ipcRenderer = dependencies.ipcRenderer || (0, _lodash.get)((0, _webpackHack.default)('electron'), 'ipcRenderer');
  ipcRenderer.on('redux-action', function (event, payload) {
    store.dispatch(payload);
  });
}