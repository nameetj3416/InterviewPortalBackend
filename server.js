//jshint esversion:6
require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');


// for authentication
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require('mongoose-findorcreate');

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

// for authentication
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb+srv://schrodinger:@cluster0.onpkw.mongodb.net/nameetDB?retryWrites=true&w=majority', {
  user: "schrodinger",
  pass: "ggi@0306",
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.set('useCreateIndex', true);


// mongodb+srv://schrodinger:@cluster0.onpkw.mongodb.net/nameetDB?retryWrites=true&w=majority
// user object
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  joinDate: String  
});

// userSchema.plugin(findOrCreate);
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//setting up strategy for google
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://schrodingerbyggi.herokuapp.com/auth/google/user",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    User.find({
      email: profile._json.email
    }, function(err, user) {
      console.log(user);
      return cb(err, user);
    });
  }
));

// authentication routes
app.get('/', function(req, res) {
  var path = require('path');
  res.sendFile(path.resolve('views/signin.html'));
  // res.render('signin');
  // res.sendFile('../views/signin.html', { root: __dirname });
  // res.sendFile('C:\Users\Nameet Jain\Desktop\backend\views\signin')
});

app.post('/login', function(req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/user');
      });
    }
  })
});

app.get('/auth/google',
  passport.authenticate('google', {
    scope: [ 'email']
  }));

app.get('/auth/google/user',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/user');
  });

app.get('/opthree', function(req, res) {
  var path = require('path');
  res.sendFile(path.resolve('views/opthree.html'));
});
app.get('/user', function(req, res) {
  if(req.isAuthenticated()){
    User.find({
      email: req.user.email
    }, 
    function(err, foundUser){
      if(err){
        console.log(err);
      }
      else{
        if(req.user.length){
          let {joinDate} = req.user[0];
          joinDate = new Date(joinDate);
          console.log(joinDate);
          let curr_date = new Date();
          curr_date.setMonth((curr_date.getMonth() - 3 + 12)%12);
          console.log(curr_date);
          const flag = (joinDate > curr_date);
          if(flag){
            var path = require('path');
            res.sendFile(path.resolve('views/library.html'));
          }
          else{
            res.redirect('/opthree');
          }
        }
        else{
          res.redirect('/opthree');
        }
      }
    });
  }
   else{
    console.log(req.user._id)
    res.redirect('/opthree');
  }
});
app.get('/product', function(req, res) {

  if(req.isAuthenticated()){
    User.find({
      email: req.user.email
    }, 
    function(err, foundUser){
      if(err){
        console.log(err);
      }
      else{
        console.log(foundUser)
        if(req.user.length){
          var path = require('path');
          res.sendFile(path.resolve('views/product.html'));
        }
        else{
          var path = require('path');
          res.sendFile(path.resolve('views/opthree.html'));
        }
      }
    });
  }
   else{
    console.log(req.user._id)
    res.redirect('/');
  }

});
app.get('/restaurant', function(req, res) {

  if(req.isAuthenticated()){
    User.find({
      email: req.user.email
    }, 
    function(err, foundUser){
      if(err){
        console.log(err);
      }
      else{
        console.log(foundUser)
        if(req.user.length){
          var path = require('path');
          res.sendFile(path.resolve('views/restaurant.html'));
        }
        else{
          var path = require('path');
          res.sendFile(path.resolve('views/opthree.html'));
        }
      }
    });
  }
   else{
    console.log(req.user._id)
    res.redirect('/');
  }
});
app.get('/intaff', function(req, res) {

  if(req.isAuthenticated()){
    User.find({
      email: req.user.email
    }, 
    function(err, foundUser){
      if(err){
        console.log(err);
      }
      else{
        console.log(foundUser)
        if(req.user.length){
          var path = require('path');
          res.sendFile(path.resolve('views/intaff.html'));
        }
        else{
          var path = require('path');
          res.sendFile(path.resolve('views/opthree.html'));
        }
      }
    });
  }
   else{
    console.log(req.user._id)
    res.redirect('/');
  }

});

app.get('/agricase', function(req, res) {

  if(req.isAuthenticated()){
    User.find({
      email: req.user.email
    }, 
    function(err, foundUser){
      if(err){
        console.log(err);
      }
      else{
        console.log(foundUser)
        if(req.user.length){
          var path = require('path');
          res.sendFile(path.resolve('views/agricase.html'));
        }
        else{
          var path = require('path');
          res.sendFile(path.resolve('views/opthree.html'));
        }
      }
    });
  }
   else{
    console.log(req.user._id)
    res.redirect('/');
  }

});

app.get('/drinkingwater', function(req, res) {

  if(req.isAuthenticated()){
    User.find({
      email: req.user.email
    }, 
    function(err, foundUser){
      if(err){
        console.log(err);
      }
      else{
        console.log(foundUser)
        if(req.user.length){
          var path = require('path');
          res.sendFile(path.resolve('views/drinkingwater.html'));
        }
        else{
          var path = require('path');
          res.sendFile(path.resolve('views/opthree.html'));
        }
      }
    });
  }
   else{
    console.log(req.user._id)
    res.redirect('/');
  }

});

app.get('/malaria', function(req, res) {

  if(req.isAuthenticated()){
    User.find({
      email: req.user.email
    }, 
    function(err, foundUser){
      if(err){
        console.log(err);
      }
      else{
        console.log(foundUser)
        if(req.user.length){
          var path = require('path');
          res.sendFile(path.resolve('views/malaria.html'));
        }
        else{
          var path = require('path');
          res.sendFile(path.resolve('views/opthree.html'));
        }
      }
    });
  }
   else{
    console.log(req.user._id)
    res.redirect('/');
  }

});
// const proxy = require('http-proxy-middleware')

// module.exports = function(app) {
//     // add other server routes to path array
//     app.use(proxy(['/' ], { target: 'http://localhost:5000' }));
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
  console.log("Server has started");
});
