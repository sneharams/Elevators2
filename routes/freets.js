const express = require('express');
const router = express.Router();
const validateThat = require('./middleware');
const Users = require('../models/Users');
const Freets = require('../models/Freets');


/**
 * List all freets.
 * 
 * @id GET api/freets
 * 
 * @return {Freets[]} - list of all stored freets
 */
router.get('/', (req, res) => {
    const msg = {
        msg: "All Freets",
        freets: Freets.findAll()
    }
    res.status(200).json(msg).end();
});

/**
 * List all freets by author.
 * 
 * @id GET api/freets/:author
 * 
 * @param  {string} author - username of author
 * @return {Freets[]} - list of all stored freets by author
 * @throws {404} - if the username of author doesn't exist
 * @throws {400} - if no author inputed
 */
router.get(
    '/:author?', 
    [
        validateThat.authorInputted,
        validateThat.authorExists
    ],
    (req, res) => {
        const author = req.params.author.substring(1);
        const msg = {
            msg: `Freets by author: ${author}`,
            freets: Freets.findAllByAuthor(author)
        }
        res.status(200).json(msg).end();
});

/**
 * Create a new freet.
 * 
 * @id POST api/freets
 * 
 * @param  {string} content - content freet contains
 * @return {Freet} - the created freet
 * @throws {403} - if the user isn't logged in
 */
router.post(
    '/', 
    [
        validateThat.userIsLoggedIn,
        validateThat.freetTextIsWithinLimit
    ],
    (req, res) => {
        const creator = Users.findUserByID(req.session.user_id).username;
        const freet = Freets.addOne(req.body.content, creator, req.session.user_id);
        const msg = {
            msg: "Freet successfully created!",
            freets: [freet]
        }
        res.status(200).json(msg).end();
});

/**
 * Update a freet.
 * 
 * @id PUT api/freets/:id
 * 
 * @param  {string} content - the new content to point to
 * @return {Freet} - the updated freet
 * @throws {403} - if the user isn't logged in or if the freet isn't authored by the logged in user
 * @throws {404} - if the freet does not exist
 */
router.put(
    '/:id?', 
    [
        validateThat.userIsLoggedIn,
        validateThat.freetExists,
        validateThat.freetIsByUser,
        validateThat.freetTextIsWithinLimit
    ],
    (req, res) => {
        const freet = Freets.updateOne(req.params.id, req.body.content);
        const msg = {
            msg: "Freet successfully edited!",
            freets: [freet]
        }
        res.status(200).json(msg).end();
});

/**
 * Delete a freet.
 * 
 * @id DELETE api/freets/:id
 * 
 * @return {Freet} - the deleted freet
 * @throws {403} - if the user isn't logged in or if the freet isn't authored by the logged in user
 * @throws {404} - if the freet does not exist
 */
router.delete(
    '/:id?', 
    [
        validateThat.userIsLoggedIn,
        validateThat.freetExists,
        validateThat.freetIsByUser
    ],
    (req, res) => {
        const freet = Freets.deleteOne(req.params.id);
        const msg = {
            msg: `Freet with ID: ${req.params.id} (below) was successfully deleted!`,
            freets: [freet]
        }
        res.status(200).json(msg).end();
});    

module.exports = router;