import xss from 'xss';
import UsersService from './users.service';
import path from 'path';

const UserController = async (req, res, next) => {
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
    console.log(userTaken);
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
    console.log(hashedPassword, newUser)
    // Return created status and new user
    return res.status(201)
      .location(path.posix.join(req.originalUrl, `/${newUser.user_id}`))
      .json({ ...UsersService.serializeUser(newUser[0]) });
  } catch (error) {
    next(error);
  }
};

export default UserController;