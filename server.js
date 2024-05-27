const express = require('express')
const fs  = require('fs')
const path = require('path')
const cors = require("cors")

const session = require("express-session");
const cookieParser = require('cookie-parser');
const app = express()


const port = process.env.PORT || 8088
const connect = require('./config/connect')
const MongoStore = require("connect-mongo");
const passport = require("passport");
const dotenv = require("dotenv");
const User = require('./DB/User/Model')
const Posts = require('./DB/Post/Routes')
const UserRouter = require('./DB/User/Routes')
dotenv.config()
console.log("mutton nalli kari ", process.env.NODE_ENV)
if(process.env.NODE_ENV==="dev"){
  console.log("WARNING, THIS APP IS IN DEVELPOMENT MODE MODE")

}
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser(process.env.APP_SECRET));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://whyonm.vercel.app'
    
  ],
  methods:['GET','POST','PUT', 'DELETE','PATCH'],
credentials: true }))
app.set("trust proxy", 1);
app.use(
    session({
      secret: process.env.APP_SECRET,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      store: MongoStore.create({ mongoUrl: process.env.MONGOURI  }),
      cookie:{
        maxAge : 3600000,
       secure: process.env.NODE_ENV ==="prod"?true:false,
        sameSite:'none',
       
       
      }
      //store: new MongoStore({ mongooseConnection: mongoose.connection}),
    })
  );
app.use(passport.initialize());
app.use(passport.session());
const localpassport = require('./DB/User/config/passport-local-strategy')
app.post('/register', function (req, res) {
    User.register(
      new User({ 
        email: req.body.email, 
        //64f5e06882c898e85ba2718a
       
      }), req.body.password, function (err, msg) {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "Successful" });
        }
      }
    )
  })
  app.post('/login', async (req, res, next) => {
    // console.log("poda punda",req.session.passport)
    console.log("hiiiiiiiii",req.body)
    const user = await User.find({'email':req.body.email})
    console.log(user)
    passport.authenticate('local', { 
      failureRedirect: '/login-failure', 
      successRedirect: '/login-success'
    })(req, res, next);
  });
  
  app.get('/login-failure', (req, res, next) => {
    console.log('failesss')
    console.log(req.user);
    return res.status(401).json({message:'login-failed'});
  });
  
  app.get('/login-success', (req, res, next) => {
    console.log("From login : ",req.session);
    console.log(req.user)
    data={
      'session':req.session,
      'user':req.user
    }
    return res.json({message:'login-success',data:data});
  });
  app.get('/getuser',(req,res,next)=>{
    if(req.isAuthenticated()){
        return res.json({'user':req.user})
    }
    else{
      return res.status(401).json({message:'please login again'})
    }
  })
  app.get('/test',(req,res)=>{
    res.send("hiiii")
  })
app.get('/write',(req,res)=>{
  console.log("original url", `${req.protocol}://${req.get('host')}${req.originalUrl}`)
  console.log("cooojkisiisiisis",req.headers.cookie)
    if( req.isAuthenticated()){
    try{
        const filePath= path.join(process.cwd(),'./landing.md')
        const mdContent = fs.readFileSync(filePath,"utf-8")
        res.json({content:mdContent,id:req.session.postId})

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
app.get('/api/test',(req,res)=>{
    try{
        const filePath = path.join(process.cwd(),'./Beriko.md')
        const mdContent = fs.readFileSync(filePath,"utf-8")
        res.json({content:mdContent})
    }catch(error){
        console.log('erorr',error)
        res.status(200).json({error:'Error reading MD'})
    }
    
})
app.get('/api/cookies',(req,res)=>{
  try{
    console.log("headers : ",req.headers)
    console.log("url : ", req.originalUrl)
    console.log("cookies: ", req.cookies)
    res.status(200).json({cookies:req.cookies})

  }catch(e){
    res.status(500).json({message:'error',error:e})

  }
})
app.delete('/logout',(req,res,next)=>{
    req.logout((error)=>{
        if(error){
            return next(error)
        }
        res.status(200).json({'message':'logoutsuccess '})
    })
    
})
app.use('/api/post',Posts)
app.use('/api/user',UserRouter)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
module.exports = app
