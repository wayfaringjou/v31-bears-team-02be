import express from 'express';
import xss from 'xss';
import UsersService from './users.service';
import path from 'path';

const usersRouter = express.Router();

usersRouter
  .post('/register', express.json(), async (req, res, next) => {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).json({
        error: `Missing '${!username ? 'Username' : 'Password'}' on request body.`
      });
    }

    const db = req.app.get('db');

    // Check that username isn't taken
    try {
      const userTaken = await UsersService.usernameTaken(db, username);
      if (userTaken) {
        return res.status(400).json({
          error: 'Username is already taken'
        });
      }
      // TODO: Check that password is valid

      // If checks pass, serialize new user and add to db
      const sanitizedUsername = xss(username);
      const hashedPassword = await UsersService.hashPassword(password);
      const newUser = await UsersService.insertUser(db, {
        username: sanitizedUsername,
        password: hashedPassword,
      });

      // Return created status and new user
      return res.status(201)
        .location(path.posix.join(req.originalUrl, `/${newUser.id}`))
        .json({ ...UsersService.serializeUser(newUser) });
    } catch (error) {
      next(error);
    }
  })

export default usersRouter;