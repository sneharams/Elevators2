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
// NEW
const floorRouter = require('./routes/floors');
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
app.use('/api/freets', freetsRouter);
//NEW
app.use('/api/floors', floorRouter);

// Catch all other routes into a meaningful error message
app.all('*', (req, res) => {
    const errorMessage = `
      hi
    `;
  
    res.status(404).send(errorMessage);
  });

module.exports = app;
