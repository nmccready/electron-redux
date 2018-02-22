"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var createElectronReduxMiddlewares = function createElectronReduxMiddlewares(middlewares) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      dependencies = _ref.dependencies;

  return middlewares.map(function (origFunc) {
    return function (_store) {
      return origFunc(_store, dependencies);
    };
  });
};

var _default = createElectronReduxMiddlewares;
exports.default = _default;