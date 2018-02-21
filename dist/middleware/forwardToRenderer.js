"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _validateAction = _interopRequireDefault(require("../helpers/validateAction"));

var _webpackHack = _interopRequireDefault(require("../helpers/webpackHack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var forwardToRenderer = function forwardToRenderer(store) {
  var dependencies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (next) {
    return function (action) {
      // eslint-disable-line no-unused-vars
      var webContents = dependencies.webContents || (0, _lodash.get)((0, _webpackHack.default)('electron'), 'webContents');
      if (!(0, _validateAction.default)(action)) return next(action);
      if (action.meta && action.meta.scope === 'local') return next(action); // change scope to avoid endless-loop

      var rendererAction = _extends({}, action, {
        meta: _extends({}, action.meta, {
          scope: 'local'
        })
      });

      var allWebContents = webContents.getAllWebContents();
      allWebContents.forEach(function (contents) {
        contents.send('redux-action', rendererAction);
      });
      return next(action);
    };
  };
};

var _default = forwardToRenderer;
exports.default = _default;