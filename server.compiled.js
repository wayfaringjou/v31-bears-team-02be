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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
   To access the database use 'app.get('db')' or inside 'app.use' with 'req.app.get('db')' */

app.set('db', (0, _knex["default"])({
  client: 'pg',
  connection: {
    host: process.env.RDS_HOSTNAME,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: NODE_ENV === 'test' ? TEST_RDS_DB_NAME : RDS_DB_NAME
  }
}));
app.set('test', function () {
  return console.log(test);
}); // Setup logger with formats for each enviroment ('common' for production and 'dev' for development)

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
  res.send('just gonna send it');
});
app.get('/flower', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var test;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return req.app.get('db').select('*').from('users');

          case 2:
            test = _context.sent;
            req.app.get('test');
            res.json({
              name: 'Dandelion',
              colour: 'Blue-ish' //test

            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); // Handle requests to /auth with usersRouter and authRouter middleware components

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
