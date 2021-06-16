"use strict";

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _users = _interopRequireDefault(require("./auth/users.router"));

var _auth = _interopRequireDefault(require("./auth/auth.router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require('dotenv').config(); // server.js
//


var PORT = process.env.HTTP_PORT || 4001; // const PORT = process.env.PORT || 4001;

var app = (0, _express["default"])();
app.use((0, _morgan["default"])(NODE_ENV === 'production' ? 'common' : 'common', {
  skip: function skip() {
    return NODE_ENV === 'test';
  }
}));
app.use(_express["default"]["static"](_path["default"].join(__dirname, 'frontend', 'build')));
app.get('/', function (req, res) {
  res.send('just gonna send it');
});
app.get('/flower', function (req, res) {
  res.json({
    name: 'Dandelion',
    colour: 'Blue-ish'
  });
});
app.use('/auth', _users["default"], _auth["default"]);
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT, "."));
});
