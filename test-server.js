const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/*
  Include the user model for saving to MongoDB VIA mongoose
*/
const User = require("./DB/User/Model");

/*
  Database connection -- We are using MongoDB for this tutorial
*/
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const conn = require('./config/connect')

const app = express();
const cors = require('cors')
app.use(cors({ credentials: true}))

/*
  Session configuration and utilization of the MongoStore for storing
  the session in the MongoDB database
*/
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,

store: new MongoStore({ mongoUrl: "mongodb+srv://raghavan20pw26:raghav0175@assignment.wbcf3qb.mongodb.net/?retryWrites=true&w=majority" })
}));

/*
  Setup the local passport strategy, add the serialize and 
  deserialize functions that only saves the ID from the user
  by default.
*/
const strategy = new LocalStrategy({
    usernameField: 'email',
}, User.authenticate());
passport.use(strategy);
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    User.findById( _id, (err, user) => {
      if(err){
          done(null, false, {error:err});
      } else {
          done(null, user);
      }
    });
  });
app.use(passport.initialize());
app.use(passport.session());

/*
  Beyond this point is all system specific routes.
  All routes are here for simplicity of understanding the tutorial
  /register -- Look closer at the package https://www.npmjs.com/package/passport-local-mongoose
  for understanding why we don't try to encrypt the password within our application
*/
app.post('/register', function (req, res) {
  User.register(
    new User({ 
      email: req.body.email, 
     
    }), req.body.password, function (err, msg) {
      if (err) {
        res.send(err);
      } else {
        res.send({ message: "Successful" });
      }
    }
  )
})

/*
  Login routes -- This is where we will use the 'local'
  passport authenciation strategy. If success, send to
  /login-success, if failure, send to /login-failure
*/
app.post('/login', passport.authenticate('local', { 
  failureRedirect: '/login-failure', 
  successRedirect: '/login-success'
}), (err, req, res, next) => {
  if (err) next(err);
});

app.get('/login-failure', (req, res, next) => {
  console.log(req.session);
  res.send('Login Attempt Failed.');
});

app.get('/login-success', (req, res, next) => {
  console.log(req.session);
  console.log(req.session.passport.user)
  res.send('Login Attempt was successful.');
});

/*
  Protected Route -- Look in the account controller for
  how we ensure a user is logged in before proceeding.
  We call 'isAuthenticated' to check if the request is 
  authenticated or not. 
*/
app.get('/write',(req,res)=>{
    console.log(req.user)
      if( req.isAuthenticated()){
      try{
          const filePath= path.join(process.cwd(),'./landing.md')
          const mdContent = fs.readFileSync(filePath,"utf-8")
          res.json({content:mdContent})
  
      }catch(error){
          console.log('erorr',error)
          res.status(200).json({error:'Error reading MD'})
      }
  }else{
      res.status(401).json({
          status:401,
          message:'access denied, try login'
      })
  }
  })
app.get('/profile', function(req, res) {
  console.log(req.session)
  if (req.isAuthenticated()) {
    res.json({ message: 'You made it to the secured profie' })
  } else {
    res.json({ message: 'You are not authenticated' })
  }
})

app.listen(8000, () => { console.log('Server started.') });
