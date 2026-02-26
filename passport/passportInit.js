// passport/passportInit.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js'; // make sure the path ends with .js

export default function passportInit() {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) return done(null, false, { message: 'Incorrect credentials.' });

          const valid = await user.comparePassword(password);
          if (!valid) return done(null, false, { message: 'Incorrect credentials.' });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) return done(new Error('User not found'));
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
