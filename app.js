const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const freetsRouter = require('./routes/freets');

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
app.use(express.static(path.join(__dirname, 'public')));

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
      POST /api/users -- Create and store a new user on the server with username and password
      <br>
      DELETE /api/users -- Delete user currently logged-into the server
      <br>
      PUT /api/users/username -- Update username of user currently logged-into the server with username
      <br>
      PUT /api/users/password -- Update password of user currently logged-into the server with password
      <br><br>
      <b>Authentication</b>
      <br>
      POST /api/users/session -- Authenticate with username and password into the server
      <br>
      DELETE /api/users/session -- End session of user currently logged-into the server
      <br><br>
      <b>Freets</b>
      <br>
      GET /api/freets -- Vew all freets on the server
      <br>
      GET /api/freets/:author -- View all freets on the server by the user with the username :author
      * the author search text is automatically modified so that the author parameter leads with '_' (ex. '_user')
      * if querying directly from url bar, then use below, where author is the actual username without the leading '_'
      * GET /api/freets/_:author
      <br>
      POST /api/freets -- Create and store a new freet on the server with the content
      <br>
      PUT /api/freets/:id -- View the freet on the server with the id :id
      <br>
      DELETE /api/freets/:id -- Delete the freet on the server with the id :id

    `;
  
    res.status(404).send(errorMessage);
  });

module.exports = app;
