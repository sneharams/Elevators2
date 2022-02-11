


/**
 * @class Room
 * 
 * 
 */
 class Room {

    constructor() {
        this.players = new Map();
        this.buildings = [];
        this.game_stage = 0;
    };

    addPlayer(username) {
        let player = {
            building: null,
            floor: null
        };
        this.players.set(username, player);
    };

    initRound() {
        if (this.game_stage == 0) {
            let building = new Building(2);
            this.players.forEach((key, value) => {

            });
        }
    };

 }

 class Building {

    constructor(num_floors, num_resources) {
        this.num_floors = num_floors;
        this.num_resources = num_resources;
        this.floors = [];
    }

    isFull() {
        if (this.floors.length < this.num_floors) {
            return false;
        }
        return true;
    }

    addFloor(username) {
        this.floors.push({
            player: username,
            resource
        })

    }

 }

 module.exports = Room;