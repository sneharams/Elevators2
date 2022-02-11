
const Room = require('../models/Room');

let rooms = new Map();
/**
 * @class Lobby
 * 
 * 
 */
 class Lobby {

    static getRoom(room_code) {
        if (rooms.has(room_code)) {
            return rooms.get(room_code);
        }
        return null;
    };

    static joinRoom(room_code, username) {
        rooms.get(room_code).addPlayer(username);
    };

    static createRoom(username) {
        let room_code = '';
        for (i = 0; i < 4; i++) {
            room_code = room_code + str(Math.floor((Math.random() * 10)));
        }
        rooms.set(room_code, new Room());
        Lobby.joinRoom(room_code, username);
    };

 }

 module.exports = Lobby;