const express = require('express');
const router = express.Router();
const validateThat = require('./middleware');
const Users = require('../models/Users');
const Freets = require('../models/Freets');


/**
 * Create a new user account.
 * 
 * @id POST api/users
 * 
 * @param   {string} username - username for new user account
 * @param   {string} password - password for new user account
 * @return  {string} - a message confirming the user has successfully created an account
 * @throws  {403} - if the user is logged in 
 * @throws  {400} - if username is already taken or username/password aren't formatted properly
 */
router.post(
    '/', 
    [
        validateThat.userIsLoggedOut,
        validateThat.usernameIsValid,
        validateThat.passwordIsValid,
        validateThat.usernameDoesNotExist
    ],
    (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        Users.addUser(username, password);
        let msg = "Hello " + username + "! You have successfully created an account!"
        res.status(200).json(msg);
});


/**
 * Create a new session.
 * 
 * @id POST api/users/session
 * 
 * @param   {string} username - username of account
 * @param   {string} password - password of account
 * @return  {string} - a message welcoming the user to their new session
 * @throws  {403} - if the user is logged in
 * @throws  {401} - if the username or password is incorrect
 */
router.post(
    '/session', 
    [
        validateThat.userIsLoggedOut,
        validateThat.credentialsAreAuthorized,
    ],
    (req, res) => {
        const user = Users.findUser(req.body.username);
        req.session.user_id = user.user_id;
        let msg = "Welcome " + req.body.username + "!";
        res.status(200).json(msg);
});


/**
 * Update a username.
 * 
 * @id PUT api/users/username
 * 
 * @param   {string} username - new username of account
 * @return  {string} - a message confirming the user's username has been successfully updated.
 * @throws  {403} - if the user isn't logged in
 * @throws  {400} - if username is already taken or username isn't formatted properly
 */
router.put(
    '/username', 
    [
        validateThat.userIsLoggedIn,
        validateThat.usernameIsDifferent,
        validateThat.usernameDoesNotExist,
        validateThat.usernameIsValid
    ],
    (req, res) => {
        let username = req.body.username;
        Freets.updateAuthor(req.session.user_id, username);
        username = Users.updateUserUsername(req.session.user_id, username).username;
        let msg = "Your username has been updated to: " + username + ".";
        res.status(200).json(msg);
});

/**
 * Updates a password.
 * 
 * @id PUT api/users/password
 * 
 * @param   {string} password - new password of account
 * @return  {string} - a message confirming the user's password has been successfully updated.
 * @throws  {403} - if the user isn't logged in
 * @throws  {400} - if the password isn't formatted properly
 */
router.put(
    '/password', 
    [
        validateThat.userIsLoggedIn,
        validateThat.passwordIsValid,
        validateThat.passwordIsDifferent
    ],
    (req, res) => {
        let password = req.body.password;
        Users.updateUserPassword(req.session.user_id, password);
        let msg = "Your password has been updated.";
        res.status(200).json(msg);
});


/**
 * Ends a session.
 * 
 * @id DELETE api/users/session
 * 
 * @return  {string} - a message confirming the user has been logged out
 * @throws  {403} - if the user isn't logged in
 */
router.delete(
    '/session', 
    [
        validateThat.userIsLoggedIn
    ],
    (req, res) => {
        req.session.user_id = null;
        let msg = "You are now signed out.";
        res.status(200).json(msg);
});


/**
 * Gets an array of usernames of authors that the user follows.
 * 
 * @id GET api/users/followed
 * 
 * @return  {string[]} - an array of usernames of authors
 * @throws  {403} - if the user isn't logged in
 */
router.get(
    '/followed',
    [
        validateThat.userIsLoggedIn
    ],
    (req, res) => {
        let followed = Users.getUserFollowed(req.session.user_id);
        let msg = {
            msg: "Here are who you follow.",
            followed: followed
        };
        res.status(200).json(msg);
    }
)

/**
 * Adds an author to user's followed.
 * 
 * @id PUT api/users/followed
 * 
 * @return  {string[]} - an array of usernames of authors
 * @throws  {403} - if the user isn't logged in
 */
router.put(
    '/followed/:author?',
    [
        validateThat.userIsLoggedIn,
        validateThat.authorExists
    ],
    (req, res) => {
        let followed = Users.addAuthorToFollowed(req.session.user_id, req.params.author);
        let msg = {
            msg: "Here is an updated array of who you follow.",
            followed: followed
        };
        res.status(200).json(msg);
    }
)

/**
 * Remove an author from user's followed.
 * 
 * @id DELETE api/users/followed
 * 
 * @return  {string[]} - an array of usernames of authors
 * @throws  {403} - if the user isn't logged in
 */
 router.delete(
    '/followed/:author?',
    [
        validateThat.userIsLoggedIn,
    ],
    (req, res) => {
        let followed = Users.removeAuthorFromFollowed(req.session.user_id, req.body.author);
        let msg = {
            msg: "Here is an updated array of who you follow.",
            followed: followed
        };
        res.status(200).json(msg);
    }
)


/**
 * Deletes a user account.
 * 
 * @id DELETE api/users
 * 
 * @return  {string} - a message confirming the user's account has been deleted
 * @throws  {403} - if the user isn't logged in
 */
router.delete(
    '/', 
    [
        validateThat.userIsLoggedIn,
    ],
    (req, res) => {
        Users.deleteUser(req.session.user_id);
        Freets.deleteFreetsByAuthor(req.session.user_id);
        req.session.user_id = null;
        let msg = "User deleted.";
        res.status(200).json(msg);
});


module.exports = router;