require('dotenv').config();
// server.js
//
import path from 'path';
import express from 'express';

import logger from 'morgan';

import usersRouter from './auth/users.router';
import authRouter from './auth/auth.router';

import { NODE_ENV } from './config';

const PORT = process.env.HTTP_PORT || 4001;
// const PORT = process.env.PORT || 4001;
const app = express();

app.use(logger((NODE_ENV === 'production') ? 'common' : 'common', {
  skip: () => NODE_ENV === 'test',
}));

app.use(express.static(path.join(__dirname, 'frontend', 'build')));


app.get('/', (req, res) => {
  res.send('just gonna send it');
});


app.get('/flower', (req, res) => {
  res.json({
    name: 'Dandelion',
    colour: 'Blue-ish'
  });
});

app.use('/auth', usersRouter, authRouter);

// Error handling
app.use((error, _req, res, _next) => {
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