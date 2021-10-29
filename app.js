const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const freetsRouter = require('./routes/freets');
const history = require('connect-history-api-fallback');

const app = express();

// Set up user session
app.use(session({
    secret: 'URL-shortener',
    resave: true,
    saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, isProduction ? 'dist' : 'public')));
app.use(history());

app.use('/', indexRouter);
app.use('/api/users', userRouter);
app.use('/api/freets', freetsRouter)

// Catch all other routes into a meaningful error message
app.all('*', (req, res) => {
    const errorMessage = `
      Cannot find the resource <b>${req.url}</b>
      <br>
      Please use only supported routes below
      <br><br>
      <b>Home Page and URL Shortening</b>
      <br>
      GET / -- Go to home page
      <br><br>
      <b>Users</b>
      <br>
      POST /#/api/users -- Create and store a new user on the server with username and password
      <br>
      DELETE /#/api/users -- Delete user currently logged-into the server
      <br>
      PUT /#/api/users/username -- Update username of user currently logged-into the server with username
      <br>
      PUT /#/api/users/password -- Update password of user currently logged-into the server with password
      <br>
      PUT /#/api/users/followed/:author -- Add the author to the currently logged-in user's followed list with the username :author
      <br>
      DELETE /#/api/users/followed/:author -- Remove the author from the currently logged-in user's followed list with the username :author
      <br>
      GET /#/api/users/followed -- View the usernames of the authors that the logged-in user currently follows
      <br>
      GET /#/api/users/upvoted -- View the freet ids of the freets that the logged-in user has liked
      <br><br>
      <b>Authentication</b>
      <br>
      POST /#/api/users/session -- Authenticate with username and password into the server
      <br>
      DELETE /#/api/users/session -- End session of user currently logged-into the server
      <br><br>
      <b>Freets</b>
      <br>
      GET /#/api/freets -- View all freets on the server
      <br>
      GET /#/api/freets/author/:author -- View all freets on the server by the user with the username :author
      <br>
      GET /#/api/freets/author_id/:author_id -- View all freets on the server by the user with the user id :author_id
      <br>
      GET /#/api/freets/followed -- View all freets on the server by that are created by authors followed by the currently logged-in user
      <br>
      POST /#/api/freets -- Create and store a new freet on the server with the content
      <br>
      GET /#/api/freets/id/:id -- View the freet on the server with the id :id
      <br>
      POST /#/api/freets/id/:id -- Refreet the freet on the server with the id :id
      <br>
      DELETE /#/api/freets/id/:id -- Delete the freet on the server with the id :id
      <br>
      PUT /#/api/freets/upvote_id/:id -- Upvote the freet on the server with the id :id
      <br>
      DELETE /#/api/freets/upvote_id/:id -- Un-upvote the freet on the server with the id :id
    `;
  
    res.status(404).send(errorMessage);
  });

module.exports = app;
