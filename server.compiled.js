"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _knex = _interopRequireDefault(require("knex"));

var _pg = _interopRequireDefault(require("pg"));

var _users = _interopRequireDefault(require("./auth/users.router"));

var _auth = _interopRequireDefault(require("./auth/auth.router"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// server.js
//
// Load enviroment variables using a .env file
require('dotenv').config(); // Utility modules


var NODE_ENV = _config["default"].NODE_ENV,
    PORT = _config["default"].PORT,
    RDS_HOSTNAME = _config["default"].RDS_HOSTNAME,
    RDS_USERNAME = _config["default"].RDS_USERNAME,
    RDS_PASSWORD = _config["default"].RDS_PASSWORD,
    RDS_PORT = _config["default"].RDS_PORT,
    RDS_DB_NAME = _config["default"].RDS_DB_NAME,
    TEST_RDS_DB_NAME = _config["default"].TEST_RDS_DB_NAME; // Moved port variable initialization to config file
// old: const PORT = process.env.HTTP_PORT || 4001;
// const PORT = process.env.PORT || 4001;
// Create express object with name app

var app = (0, _express["default"])();
/* Establish connection to database and save as property of the express app with name 'db'
   To access the database req.app.get('db') */

app.set('db', (0, _knex["default"])({
  client: 'pg',
  connection: {
    host: "".concat(RDS_HOSTNAME, ":").concat(RDS_PORT),
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: NODE_ENV === 'test' ? TEST_RDS_DB_NAME : RDS_DB_NAME
  }
})); // Setup logger with formats for each enviroment ('common' for production and 'dev' for development)

app.use((0, _morgan["default"])(NODE_ENV === 'production' ? 'common' : 'dev', {
  // Skip logging when run in test enviroment
  skip: function skip() {
    return NODE_ENV === 'test';
  }
})); // Append logging to file

app.use((0, _morgan["default"])('common', {
  // create a write stream in append mode and log to file 'access.log'
  stream: _fs["default"].createWriteStream(_path["default"].join(__dirname, 'access.log'), {
    flags: 'a'
  })
})); // Serve static files located in frontend/build

app.use(_express["default"]["static"](_path["default"].join(__dirname, 'frontend', 'build')));
app.get('/', function (req, res) {
  console.log(req.app.get('db'));
  res.send('just gonna send it');
});
app.get('/flower', function (req, res) {
  res.json({
    name: 'Dandelion',
    colour: 'Blue-ish'
  });
}); // Handle requests to /auth with usersRouter and authRouter middleware components

app.use('/auth', _users["default"], _auth["default"]); // Error handling

app.use(function (error, req, res, next) {
  var response;

  if (NODE_ENV === 'production') {
    response = {
      error: error.message
    };
  } else {
    console.error(error);
    response = {
      error: error.message
    };
  }

  res.status(500).json(response);
});
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT, "."));
});
