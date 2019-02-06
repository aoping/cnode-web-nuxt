const passport = require('koa-passport')
import {
  newAndSave,
  getUsersByNames
} from './database/services/user'

var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: '3cf00be92fbdca5bbb00',
    clientSecret: 'de6f3621b264d3ac637b2fd60598b0989e5eb385',
    callbackURL: "http://127.0.0.1:3001/auth/github/callback",
    userAgent: 'myapp.com'
  },
  async function (accessToken, refreshToken, profile, cb) {
    let user = await getUsersByNames(profile.username)
    if (user && user.length > 0) return cb(null, user[0])
    else {
      user = await newAndSave(profile.displayName, profile.username, '', profile.emails[0].value, profile.photos[0].value, true)
      console.log(user)
      return cb(null, user)
    }
  }
));
