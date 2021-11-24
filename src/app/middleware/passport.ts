import { Request, Response, NextFunction } from 'express';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';

import User from '../models/user';
import KEYS from '../../config/keys';
import InvalidCredentials from '../../utils/errors/invalid-credentials';

declare global {
  namespace Express {
    interface User {
      _id: string;
      login: string;
    }
  }
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: KEYS.JWT_SECRET_KEY,
};

const passportMiddleware = (): void => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await User.findById(payload.userId).select('login id');
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        console.log(error);
      }
    })
  );
};

function jwtAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      next(err);
      return;
    }
    if (!user) {
      res.json(new InvalidCredentials());
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
}

export { passportMiddleware, jwtAuthenticate };
