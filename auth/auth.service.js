import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';

const AuthService = {
    secret: config.JWT_SECRET,
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash);
    },
    createJWT(subject, payload) {
        return jwt.sign(payload, this.secret, {
            subject,
            algorithm: 'HS256',
        });
    },
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        });
    },
}

export default AuthService;