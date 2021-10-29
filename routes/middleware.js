const Users = require('../models/Users');
const Freets = require('../models/Freets');

// Checks that the username isn't taken by another user
const usernameDoesNotExist = (req, res, next) => {
    const user = Users.findUser(req.body.username);
    if (user) {
        res.status(400).json({
            error: `Username: ${req.body.username} already exists.`,
        }).end();
        return;
    }
    next();
};

// Checks that the username and password are correct
const credentialsAreAuthorized = (req, res, next) => {
    const user = Users.findUser(req.body.username);
    if (!user || user.password !== req.body.password) {
        res.status(401).json({
            error: `Username or password incorrect.`,
        }).end();
        return;
    }
    next();
};

// Checks that the username is of valid formatting
const usernameIsValid = (req, res, next) => {
    const username = req.body.username;
    if (!(/^[A-Za-z0-9]+$/.test(username) && username.length >= 4 && username.length <=16)) {
        res.status(400).json({
            error: `Invalid username: ${username}. Must be between 4 and 16 characters (inclusive) and only contain letters and numbers.`,
        }).end();
        return;
    }
    next();
};

// Checks that the password is of valid formatting
const passwordIsValid = (req, res, next) => {
    const password = req.body.password;
    if (!(/^[A-Za-z0-9]+$/.test(password) && password.length >= 4)) {
        res.status(400).json({
            error: `Invalid password. Must be at least 4 characters and only contain letters and numbers.`,
        }).end();
        return;
    }
    next();
};

// Checks that the username is different from the current username
const usernameIsDifferent = (req, res, next) => {
    const new_username = req.body.username;
    const cur_username = Users.findUserByID(req.session.user_id).username;
    if (cur_username == new_username) {
        res.status(400).json({
            error: `Username must be different than the current username.`,
        }).end();
        return;
    }
    next();
};

// Checks that the password is different from the current password
const passwordIsDifferent = (req, res, next) => {
    const new_password = req.body.password;
    const cur_password = Users.findUserByID(req.session.user_id).password;
    if (cur_password == new_password) {
        res.status(400).json({
            error: `Password must be different than the current password.`,
        }).end();
        return;
    }
    next();
};


// Checks that the username is set in session, i.e., user logged in
const userIsLoggedIn = (req, res, next) => {
    if (req.session.user_id == null) {
        res.status(403).json({
            error: 'You must be logged in!'
        }).end();
        return;
    }
    next();
};

// Checks that the username isn't set in session, i.e., user logged out
const userIsLoggedOut = (req, res, next) => {
    if (req.session.user_id != null) {
        const username = Users.findUserById(req.session.user_id).username;
        res.status(403).json({
            error: 'You must be logged out!',
            username: username
        }).end();
        return;
    }
    next();
};

// Checks that the username of author exists
const authorExists = (req, res, next) => {
    let author = req.params.author;
    const user = Users.findUser(author);
    if (!user) {
        res.status(404).json({
            error: `Author: ${author} doesn't exist.`,
        }).end();
        return;
    }
    next();
};

// Checks that the ID of author exists
const authorIDExists = (req, res, next) => {
    let id = req.params.author_id;
    const user = Users.findUserByID(id);
    if (!user) {
        // don't want to expose ID to client
        res.status(404).json({
            error: `A user with that ID doesn't exist.`,
        }).end();
        return;
    }
    next();
};

// Checks that an author is inputted
const authorInputted = (req, res, next) => {
    if (req.params.author == undefined) {
        res.status(400).json({
            error: `No author name inputted.`,
        }).end();
        return;
    }
    next();
};

// Checks that the freet ID exists
const freetExists = (req, res, next) => {
    const freet = Freets.findOne(req.params.id);
    if (!freet) {
        res.status(404).json({
            error: `Freet ID: ${req.params.id} doesn't exist.`,
        }).end();
        return;
    }
    next();
};

// Checks that the freet is by the logged-in user
const freetIsByUser = (req, res, next) => {
    const freet_obj = Freets.findOneObj(req.params.id);
    if (freet_obj.user_id != req.session.user_id) {
        res.status(403).json({
            error: `Freet ID: ${req.params.id} isn't authored by you.`,
        }).end();
        return;
    }
    next();
};

// Checks that the number of characters in the freet is <= 140
const freetTextIsWithinLimit = (req, res, next) => {
    const freet_length = req.body.content.length;
    if (freet_length > 140) {
        res.status(400).json({
            error: `This Freet contains ${freet_length} characters. Freets can't be greater than 140 characters.`,
        }).end();
        return;
    }
    next();
};

// Checks that the user has not already upvoted the freet
const freetIsNotUpvoted = (req, res, next) => {
    const user = Users.findUserByID(req.session.user_id);
    if (user.upvotes.includes(req.params.id)) {
        res.status(409).json({
            error: `Freet ID: ${req.params.id} was already upvoted.`
        }).end();
        return;
    }
    next();
}

// Checks that the user has already upvoted the freet
const freetIsUpvoted = (req, res, next) => {
    const user = Users.findUserByID(req.session.user_id);
    if (!user.upvotes.includes(req.params.id)) {
        res.status(409).json({
            error: `Freet ID: ${req.params.id} wasn't upvoted previously.`
        }).end();
        return;
    }
    next();
}

// Checks that the user has already followed the author
const authorIsFollowed = (req, res, next) => {
    const followed = Users.getUserFollowed(req.session.user_id);
    const followed_ids = followed.map(author => author.user_id);
    if (!followed_ids.includes(req.params.author_id)) {
        const author = Users.findUserByID(req.params.author_id);
        res.status(409).json({
            error: `Author: ${author.username} wasn't followed previously.`
        }).end();
        return;
    }
    next();
}

// Checks that the user hasn't already followed the author
const authorIsNotFollowed = (req, res, next) => {
    const followed = Users.getUserFollowed(req.session.user_id);
    const followed_ids = followed.map(author => author.user_id);
    if (followed_ids.includes(req.params.author_id)) {
        const author = Users.findUserByID(req.params.author_id);
        res.status(409).json({
            error: `Author: ${author.username} was already followed.`
        }).end();
        return;
    }
    next();
}



module.exports = Object.freeze({
    usernameDoesNotExist,
    usernameIsValid,
    passwordIsValid,
    usernameIsDifferent,
    passwordIsDifferent,
    credentialsAreAuthorized,
    userIsLoggedIn,
    userIsLoggedOut,
    authorExists,
    authorIDExists,
    authorInputted,
    freetExists,
    freetIsByUser,
    freetTextIsWithinLimit,
    freetIsNotUpvoted,
    freetIsUpvoted,
    authorIsFollowed,
    authorIsNotFollowed
});