import express from 'express';
import AuthService from './auth.service';

const authRouter = express.Router();

// Fake user to replace db entry
const fakeUser = {
    id: 1,
    username: 'demo',
    // Generated with bcrypt.hash('demo', 12, callbackFn)
    password: `$2a$12$2Ta9euhV8bLG/hRGYBw8Qun7MsN5QtruGI1ddBUu75Tm31k7TpJ1i`,

}

authRouter
    .post('/login', express.json(), async (req, res, next) => {
        // Destructure request
        const { username, password } = req.body;
        // Check that values aren't missing
        if (!(username && password)) {
            return res.status(400).json({
                error: `Missing '${!username ? 'Username' : 'Password'}' on request body.`,
            });
        }

        try {
            // Check if username is in fake database
            if (username !== fakeUser.username) throw new Error('Wrong username');

            // If user found, check for password next
            const validPassword = await AuthService.comparePasswords(password, fakeUser.password);
            // If password not found return error
            if (!validPassword) throw new Error('Wrong password');

            // If both found return authorization token
            return res.send({
                authToken: AuthService.createJWT(fakeUser.username, { userid: fakeUser.id }),
            });
        } catch (error) { next(error) };
    })

export default authRouter;