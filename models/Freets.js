let data = [];
let id_num = 0;

/**
 * @typedef FreetObj
 * @prop {string} id      - id of the freet
 * @prop {string} user_id - the id of the author of the freet
 * @prop {Freet}  freet   - the freet that is displayed
 */

/**
 * @typedef Freet
 * @prop {string} id      - id of the freet
 * @prop {string} content - the content of the freet
 * @prop {string} author  - username of the author
 */

/**
 * @class Freets
 * 
 * Stores all freets in freet objects. Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Freets {

  /**
   * Add a freet to the collection.
   * 
   * @param  {string} content - the content of the freet
   * @param  {string} author  - the username of the author
   * @param  {string} user_id - the user_id of the author
   * @return {Freet} - the newly created freet
   */
  static addOne(content, author, user_id) {
    const id = id_num.toString();
    const freet = {id, content, author};
    const freet_obj = {id, user_id, freet};
    id_num = id_num + 1;
    data.push(freet_obj);
    return freet_obj.freet;
  }

  /**
   * Find a freet by Id.
   * 
   * @param {string} id - the id of the freet to find
   * @return {Freet | undefined} - the found freet with above id
   */
  static findOne(id) {
    const freets = data.map(freet_obj => freet_obj.freet);
    const freet = freets.filter(freet => freet.id === id)[0];
    return freet;
  }

  /**
   * Find a freet_obj by Id.
   * 
   * @param {string} id - the id of the freet_obj to find
   * @return {FreetObj | undefined} - the found freet_obj with above id
   */
  static findOneObj(id) {
    const freet_obj = data.filter(freet_obj => freet_obj.id === id)[0];
    return freet_obj;
  }

  /**
   * Find all freets.
   * 
   * @return {Freet[]} an array of all of the freets
   */
  static findAll() {
    const freets = data.map(freet_obj => freet_obj.freet);
    return freets;
  }

  /**
   * Find all freets from a certain author
   * 
   * @param {string} author - the author whos freets to find
   * @return {Freet[]} an array of all of the freets
   */
  static findAllByAuthor(author) {
    const freet_objs =  data.filter(freet_obj => freet_obj.freet.author === author);
    const freets = freet_objs.map(freet_obj => freet_obj.freet);
    return freets;
  }

  /**
   * Update a Freet's content.
   * 
   * @param {string} id      - The id of the freet to update
   * @param {string} content - The new Content to associate with the freet
   * @return {Freet | undefined} - The updated freet
   */
  static updateOne(id, content) {
    const freet = Freets.findOne(id);
    freet.content = content;
    return freet;
  }

   /**
   * Update the author name of freets by that user.
   * 
   * @param {string} user_id  - The user_id of the author of the freets
   * @param {string} new_name - The new name of the author of the freets
   */
  static updateAuthor(user_id, new_name) {
    const freet_objs =  data.filter(freet_obj => freet_obj.user_id === user_id);
    freet_objs.forEach(function (freet_obj) {
      freet_obj.freet.author = new_name;
    });
  }

  /**
   * Delete a Freet from the collection.
   * 
   * @param {string} id - id of freet to delete
   * @return {Freet | undefined} - deleted freet
   */
  static deleteOne(id) {
    const freet = Freets.findOne(id);
    data = data.filter(f => f.freet !== freet);
    return freet;
  }

  /**
   * Delete Freets by a user
   * 
   * @param {string} user_id - user_id of freets to delete
   */
  static deleteFreetsByAuthor(user_id) {
    data = data.filter(f => f.user_id !== user_id);
  }
}

module.exports = Freets;