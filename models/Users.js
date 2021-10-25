let users = [];
let id_num = 0;

/**
 * @typedef User
 * @prop {string} user_id  - user_id for account
 * @prop {string} username - username for account
 * @prop {string} password - password for account
 * @prop {array} following - users that account follows
 * @prop {array} upvotes - all freets that user has liked 

 */

/**
 * @class Users
 * 
 * Stores all users. Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Users {

    /**
     * Add a user.
     * 
     * @param   {string} username - username for account
     * @param   {string} password - password for account
     * @return  {User} - the created user
     */
    static addUser(username, password) {
        const user_id = id_num.toString();
        const following = [];
        const user = {
            user_id, 
            username, 
            password,
            following
        };
        id_num += 1;
        users.push(user);
        return user;
    }

    /**
     * Delete a user.
     * 
     * @param   {string} user_id - user_id of account
     */
    static deleteUser(user_id) {
        const user = this.findUserByID(user_id);
        users = users.filter(u => u !== user);
    }

    /**
     * Find a user.
     * 
     * @param   {string} username - username for account
     * @return  {User | undefined} - the found user with the above id
     */
    static findUser(username) {
        return users.filter(user => user.username === username)[0];
    }

    /**
     * Find a user by thier ID.
     * 
     * @param   {string} user_id - user_id of account
     * @return  {User | undefined} - the found user with the above id
     */
    static findUserByID(user_id) {
        return users.filter(user => user.user_id === user_id)[0];
    }

    /**
     * Update a user's username.
     * 
     * @param   {string} user_id       - the user_id of the user account
     * @param   {string} new_username - the new username of the user
     * @return  {User} - the updated user
     */
    static updateUserUsername(user_id, new_username) {
        const user = Users.findUserByID(user_id);
        user.username = new_username;
        return user;
    }

    /**
     * Update a user's password.
     * 
     * @param   {string} user_id       - the user_id of the user account
     * @param   {string} new_password - the new password of the user account
     * @return  {User} - the updated user
     */
     static updateUserPassword(user_id, new_password) {
        const user = Users.findUserByID(user_id);
        user.password = new_password
        return user;
    }

    /**
     * Add an authors to user's following array.
     * 
     * @param   {string} user_id       - the user_id of the user account
     * @param   {string} author_name   - the username of the author to follow
     * @return  {string[]} - an updated array of usernames of followed authors
     */
    static addAuthorToFollowed(user_id, author_name) {
        const author = Users.findUser(author_name);
        const user = Users.findUserByID(user_id);
        user.following.push(author);
        return Users.getUserFollowed(user_id);
    }

    /**
     * Remove an authors from the user's following array.
     * 
     * @param   {string} user_id       - the user_id of the user account
     * @param   {string} author_name   - the username of the author to remove
     * @return  {string[]} - an updated array of usernames of followed authors
     */
         static addAuthorToFollowed(user_id, author_name) {
            const author = Users.findUser(author_name);
            const user = Users.findUserByID(user_id);
            user.following = user.following.filter(u => u.username !== author_name);
            return Users.getUserFollowed(user_id);
        }

    /**
     * Get an array of the authors the user is following.
     * 
     * @param   {string} user_id       - the user_id of the user account
     * @return  {string[]} - an array of usernames of followed authors
     */
    static getUserFollowed(user_id) {
        const user = Users.findUserByID(user_id);
        const followingNames = user.following.map(author => author.username);
        return followingNames;
    }

    /**
     * Add upvoted freet to list 
     * 
     * @param   {string} freet_id       - the freet_id of the freet that was upvoted 
     * @return  {string[]} - an array of upvoted freets
     */
     static addUpvotedFreet(freet_id) {
        upvotes.push(freet_id); 
        return upvotes;
    }

     /**
     * Delete upvoted freet from list 
     * 
     * @param   {string} freet_id       - the freet_id of the freet that was upvoted 
     * @return  {string[]} - an array of upvoted freets
     */
      static removeUpvotedFreet(freet_id) {
        
        upvotes.delete(freet_id);
        return upvotes; 
    }
}

module.exports = Users;