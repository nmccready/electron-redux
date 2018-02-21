"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _validateAction = _interopRequireDefault(require("../helpers/validateAction"));

var _webpackHack = _interopRequireDefault(require("../helpers/webpackHack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {
  return undefined;
};

var forwardToMain = function forwardToMain(store) {
  var dependencies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (next) {
    return function (action) {
      // eslint-disable-line no-unused-vars
      var ipcRenderer = dependencies.ipcRenderer || (0, _lodash.get)((0, _webpackHack.default)('electron'), 'ipcRenderer');
      var doValidateAction = dependencies.doValidateAction != null ? dependencies.doValidateAction : true;
      var debug = dependencies.debug || noop;

      if (doValidateAction && !(0, _validateAction.default)(action)) {
        debug(function () {
          return "invalid action, skipping";
        });
        return next(action);
      }

      ;

      if (action.type.substr(0, 2) !== '@@' && action.type.substr(0, 10) !== 'redux-form' && (!action.meta || !action.meta.scope || action.meta.scope !== 'local')) {
        debug(function () {
          return "sending: redux-action type ".concat(action.type);
        });
        ipcRenderer.send('redux-action', action); // stop action in-flight
        // eslint-disable-next-line consistent-return

        return;
      } // eslint-disable-next-line consistent-return


      return next(action);
    };
  };
};

var _default = forwardToMain;
exports.default = _default;