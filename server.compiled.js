"use strict";

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _knex = _interopRequireDefault(require("knex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// server.js
//
require('dotenv').config();

var router = require('./routes'); // const PORT = process.env.HTTP_PORT || 4001;


var PORT = process.env.PORT || 4001;
var app = (0, _express["default"])();
app.set('db', (0, _knex["default"])({
  client: 'pg',
  connection: {
    database: process.env.RDS_DB_NAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    host: process.env.RDS_HOSTNAME
  }
}));
app.use(_express["default"]["static"](_path["default"].join(__dirname, 'frontend', 'build')));
app.get('/', function (req, res) {
  res.send('just gonna send it');
});
app.get('/flower', function (req, res) {
  res.json({
    name: 'Dandelion',
    colour: 'Blue-ish',
    env: process.env,
    // for testing
    port: PORT // for testing

  });
});
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT, "."));
}); // express.json() is a built-in middleware, parses incoming JSON requests, returns Object

app.use(_express["default"].json());
app.use(router);
