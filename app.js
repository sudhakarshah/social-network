var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt= require('bcrypt');
var mongo = require('mongodb');
var mongoose= require('mongoose');
var session = require('express-session');
var db = mongoose.connect('mongodb://localhost:27017/sn');
//var index = require('./routes/index');
var Account= require('./models/Account');
var Post= require('./models/Post');
var app = express();

// view engine setup
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'ssshhhhh',
resave: false,
    saveUninitialized: false}));


// change the server port number if required
/*
app.listen(3000, function(){
	console.log("Server running on 3000...");
})
*/


// Checking if session exists
var authenticate = function(req,res,next){
  if (req.session && req.session.user) return next();
  return res.redirect('/login');
}


// GET home page
app.get('/', function(req, res, next) {
  if (req.session && req.session.user){
    // Finding all the posts from the database
    Post.find({},function(error,posts){
        res.render('index',{title:"home",posts:posts});
    });
  }
  else res.render('welcome', { title: "Social Network" });
});


app.get('/post',authenticate,function(req,res){
  res.render('post',{title:"Post Something"});
});


app.post('/post',authenticate,function(req,res){
  if(req.body && req.body.post){
    Post.create({
      post: req.body.post,
      author: req.session.user._id,
      username: req.session.user.username
      },function(error,post){
        if(error) return console.log("Error in adding the post to database");
        console.log("Post created");
        res.redirect("/")
      }
    );
  }
});


app.get('/login',function(req,res){
  res.render('login', { title: "login" });
});


app.get('/signup',function(req,res){
  res.render('signup', { title: "signup" });
});


// login request handler
app.post('/login',function(req,res){
  if (!req.body.username || !req.body.password){
    return res.render('login', { title: "login" , message: "Please Enter both username and password"});
  }
  //finding username from account database
  Account.findOne({username:req.body.username},function(error,account)
  {
    if (error) return console.log("error in accessing the database");
    else if (!account) return res.render('login', { title: "login" , message: "Username doesnot Exists"});
    // creating a new session
    if (account.compare(req.body.password)){
      req.session.user = account;
      req.session.save();
      console.log("saved");
      console.log(req.session.user.username);
      console.log(req.session);
      //res.render('index',{title:"home",posts:"posts"});
      res.redirect('/');
    }
    else return res.render('login', { title: "login" , message: "Wrong password"});
  });
});


// sign up a new account handler
app.post('/signup',function(req,res){
  if (!req.body.username || !req.body.password){
    return res.render('signup', { title: "signup" , message: "Please Enter both username and password"});
  }
  //finding username from account database
  Account.findOne({username: req.body.username}, function(error,account)
  {
    if(account) return res.render('signup', { title: "signup" , message: "Username Already Exists"});
    else if (error) return console.log("error in accessing the database");
    // creating a new account
    else{
    Account.create({
      username : req.body.username,
      password : req.body.password
      },function(error,account){
        if (error) return console.log("Error in adding User to Database");
        else res.redirect('/');
        });
    }
  });
});


//logout request
app.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect("/");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
