// Axios responses have a lot of data. This shows only the most relevant data.
function showResponse(axiosResponse, callback) {
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  const abridgedResponse = {
    data: fullResponse.data,
    status: fullResponse.status,
    statusText: fullResponse.statusText,
  };
  callback(abridgedResponse);
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 * 
 * You can use axios to make API calls like this:
 * const body = { bar: 'baz' };
 * axios.post('/api/foo', body)
 *   .then(showResponse) // on success (Status Code 200)
 *   .catch(showResponse); // on failure (Other Status Code)
 * See https://github.com/axios/axios for more info
 */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 * CallbackSuccess is a function that formats and displays a successful response
 * CallbackFailure is a function that formats and displays a failed response
 */
function createUser(fields, callbackSuccess, callbackFailure) {
  axios.post('/api/users', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function changeUsername(fields, callbackSuccess, callbackFailure) {
  axios.put('/api/users/username', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function changePassword(fields, callbackSuccess, callbackFailure) {
  axios.put('/api/users/password', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function addAuthorToFollowed(fields, callbackSuccess, callbackFailure) {
  axios.put('/api/users/followed/' + fields.author, fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function removeAuthorFromFollowed(fields, callbackSuccess, callbackFailure) {
  axios.delete('/api/users/followed/' + fields.author, fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function getFollowedAuthors(fields, callbackSuccess, callbackFailure) {
  axios.get('/api/users/followed', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function getUpvotes(fields, callbackSuccess, callbackFailure) {
  axios.get('/api/users/upvoted', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function deleteUser(fields, callbackSuccess, callbackFailure) {
  axios.delete('/api/users', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function signIn(fields, callbackSuccess, callbackFailure) {
  axios.post('/api/users/session', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function signOut(fields, callbackSuccess, callbackFailure) {
  axios.delete('/api/users/session', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function viewAllFreets(fields, callbackSuccess, callbackFailure) {
  axios.get('/api/freets', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function viewFreetsByAuthor(fields, callbackSuccess, callbackFailure) {
  axios.get('/api/freets/author/'+ fields.author, fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function viewFreetByID(fields, callbackSuccess, callbackFailure) {
  axios.get('/api/freets/id/'+ fields.id, fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function viewFreetsByFollowedAuthors(fields, callbackSuccess, callbackFailure) {
  axios.get('/api/freets/followed', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function createFreet(fields, callbackSuccess, callbackFailure) {
  axios.post('/api/freets', fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function refreetFreet(fields, callbackSuccess, callbackFailure) {
  axios.post('/api/freets/id/' + fields.id, fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function editFreet(fields, callbackSuccess, callbackFailure) {
  axios.put('/api/freets/id/' + fields.id, fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function deleteFreet(fields, callbackSuccess, callbackFailure) {
  axios.delete('/api/freets/id/' + fields.id, fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function upvoteFreet(fields, callbackSuccess, callbackFailure) {
  axios.put('/api/freets/upvote_id/' + fields.id , fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}

function unvoteFreet(fields, callbackSuccess, callbackFailure) {
  axios.delete('/api/freets/upvote_id/' + fields.id , fields)
    .then(response => showResponse(response, callbackSuccess)) // on success (Status Code 200)
    .catch(response => showResponse(response, callbackFailure)); // on failure (Other Status Code)
}
