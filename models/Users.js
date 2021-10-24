let users = [];
let id_num = 0;

/**
 * @typedef User
 * @prop {string} user_id  - user_id for account
 * @prop {string} username - username for account
 * @prop {string} password - password for account
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
        const user = {user_id, username, password};
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

}

module.exports = Users;