  const User = require('../Model')
const passport = require('passport')
const passportlocalstrategy = require('passport-local').Strategy
passport.use(new passportlocalstrategy({
    usernameField:'email',
},User.authenticate()))

passport.serializeUser(async function (user, done) {
  const u = await User.find({'email':user.email})
  console.log(u)
    console.log("serializing user ",user.email)
    done(null, user.id, user.email);
  });
  
passport.deserializeUser(async (id, done) => {
    done(null, await User.findById(id));
  });
