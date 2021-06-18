import express from 'express';

import UserController from './users.controller';

const usersRouter = express.Router();

usersRouter
  .post('/register', express.json(), UserController);

export default usersRouter;