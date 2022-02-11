<template>
  <div class="main" id="app">
    <Grid 
      v-bind:cells="cells"
      v-on:toggle-active="handleActiveToggle"
    />
    <div class="options">
      <div>
        <div class="info-container">
          <Timer/>
        </div>
        <div class="options-container">
          <p> {{ title }} </p>
          <Options
            v-if="active_r != 5"
            v-bind:elevator="active_cell.elevator"
            v-bind:rem_elevators="rem_elevators"
            v-bind:move_state="move_elevator"
            v-on:toggle-elevator="handleElevatorToggle"
            v-on:move-elevator="handleElevatorMove"
            v-on:toggle-direction="handleElevatorDirection"
            v-on:cancel="handleCancel"
          />
        </div>
        <input 
          v-if="id == null"
          type="button" 
          value="Join Game"
          v-on:click="handleJoin"
        />
        <div v-if="id != null">
          You're id is {{ id }}
        </div>
        <div class="chat-container">
          <p> Chats </p>
          <Chats/>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script src="../public/services.js"></script>
<script>
  import Options from './components/Options.vue';
  import Grid from './components/Grid.vue';
  import Chats from './components/Chats.vue';
  import Timer from './components/Timer.vue';

  export default {
    name: 'app',
    components: {Options, Grid, Chats, Timer},
    data() {
      return {
        cells: [],
        active_r: 5,
        active_c: 5,
        rem_elevators: 2,
        move_elevator: false,
        id: null
      }
    },

    computed: {
      active_cell: function() {
        if (this.active_r == 5) {
          return null;
        }
        return this.cells[this.active_r][this.active_c];
      },
      title: function() {
        if (this.active_r == 5) {
          return 'Click on a floor tile to see options.';
        }
        else if (this.move_elevator == true) {
          return 'Click on the floor tile you want to move the elevator to.'
        }
        return 'Options';
      }
    },

    mounted() {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (j == 0) {
            this.cells.push([])
          }
          this.cells[i].push({
            r: i,
            c: j,
            active: false,
            elevator: false,
            elevator_up: true,
            key: i + "x" + j
          })
        }
      }
    },

    methods: {
      handleJoin() {
        const fields = {};
        addFloor(fields, this.joinSuccess, this.joinFailure);
      },
      joinSuccess(res) {
        this.id = res.data.id;
      },
      joinFaliure(res) {
        console.log("uh oh");
      },
      handleCancel() {
        this.move_elevator = false;
      },
      handleElevatorToggle() {
        this.cells[this.active_r][this.active_c].elevator_up = true;
        this.cells[this.active_r][this.active_c].elevator = !this.cells[this.active_r][this.active_c].elevator;
        if (this.cells[this.active_r][this.active_c].elevator == true) {
          this.rem_elevators -= 1;
        } else {
          this.rem_elevators += 1;
        }
      },
      handleElevatorMove() {
          this.move_elevator = true;
      },
      handleElevatorDirection() {
        this.cells[this.active_r][this.active_c].elevator_up = !this.cells[this.active_r][this.active_c].elevator_up;
      },
      handleActiveToggle(r, c) {
        if (this.move_elevator == true) {
          this.cells[this.active_r][this.active_c].elevator = false;
          this.cells[r][c].elevator = true;
          this.cells[r][c].elevator_up = this.cells[this.active_r][this.active_c].elevator_up;
          this.cells[this.active_r][this.active_c].elevator_up = true;
          this.cells[this.active_r][this.active_c].active = false;
          this.cells[r][c].active = true;
          this.active_r = r;
          this.active_c = c;
          this.move_elevator = false;
        }
        else {
          if (this.active_r == r && this.active_c == c) {
            this.cells[this.active_r][this.active_c].active = false;
            this.active_r = 5;
            this.active_c = 5;
          }
          else {
            if (this.active_r != 5 && this.active_c != 5) {
              this.cells[this.active_r][this.active_c].active = false;
            }
            this.cells[r][c].active = true;
            this.active_r = r;
            this.active_c = c;
          }
        }
      },
    }
  } 
</script>

<style>
  input:focus {
    outline: none;
  }

  .options {
    width: 20vw;
    min-width: 32vh;
    padding: 10vh 5vw 5vh 5vw;
    height: 85vh;
    display: flex;
    flex-direction: column;
    background-color: lightgray;
  }

  .main {
    display: flex;
    margin: auto;
    width: 100%;
    height: 100%;
    flex-direction: row;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: dimgray;
  }

  p {
    font-size: 2vh;
    text-align: center;
  }

</style>
