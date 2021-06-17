// server.js
//
// Load enviroment variables using a .env file
require('dotenv').config();
// Utility modules
import path from 'path';
import fs from 'fs';
// Api framework and related modules
import express from 'express';
import logger from 'morgan';
// Database query builder
import knex from 'knex';
import pg from 'pg';
// Express Routes
import usersRouter from './auth/users.router';
import authRouter from './auth/auth.router';
// Import globals from enviroment variables
import config from './config';
const { NODE_ENV, PORT, RDS_HOSTNAME, RDS_USERNAME, RDS_PASSWORD, RDS_PORT, RDS_DB_NAME, TEST_RDS_DB_NAME } = config;

// Moved port variable initialization to config file
// old: const PORT = process.env.HTTP_PORT || 4001;
// const PORT = process.env.PORT || 4001;

// Create express object with name app
const app = express();
/* Establish connection to database and save as property of the express app with name 'db'
   To access the database use 'app.get('db')' or inside 'app.use' with 'req.app.get('db')' */
app.set('db', knex({
  client: 'pg',
  connection: {
    host: RDS_HOSTNAME,
    port: RDS_PORT,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    database: NODE_ENV === 'test' ? TEST_RDS_DB_NAME : RDS_DB_NAME,
  },
}));

// Setup logger with formats for each enviroment ('common' for production and 'dev' for development)
app.use(logger((NODE_ENV === 'production') ? 'common' : 'dev', {
  // Skip logging when run in test enviroment
  skip: () => NODE_ENV === 'test',
}));
// Append logging to file
app.use(logger('common', {
  // create a write stream in append mode and log to file 'access.log'
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))

// Serve static files located in frontend/build
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('/', (req, res) => {
  res.send('just gonna send it');
});

app.get('/flower', async (req, res) => {
  const test = await req.app.get('db').select('*').from('user');
  res.json({
    name: 'Dandelion',
    colour: 'Blue-ish',
    test
  });
});

// Handle requests to /auth with usersRouter and authRouter middleware components
app.use('/auth', usersRouter, authRouter);

// Error handling
app.use((error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: error.message };
  } else {
    console.error(error);
    response = { error: error.message };
  }
  res.status(500).json(response);
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
});