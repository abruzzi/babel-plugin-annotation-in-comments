"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _analytics = require("@abc/analytics");
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var MenuItem = function MenuItem() {
  // @operational("menuitem clicked")
  var handleClick = function handleClick(e) {
    (0, _analytics.fireUIEvent)("menuitem clicked");
    console.log(e.target.value);
  };
  return <div>
    <button onClick={handleClick}>Click me</button>
  </div>;
};
var _default = exports["default"] = MenuItem;