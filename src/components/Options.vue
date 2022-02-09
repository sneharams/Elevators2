<template>
    <div>
        <input type="button" class="cell-option"
            v-for="option in options"
            v-bind:key="option.text"
            :value="option.text"
            v-on:click="option.handler"
        />
    </div>
</template>

<script>
    export default {
        name: 'Options',
        props: ['elevator', 'rem_elevators', 'move_state'],
        computed: {
            options: function() {
                if (this.move_state == true) {
                    return [{
                        text: 'Cancel',
                        handler: this.handleCancel
                    }];
                } 
                else {
                    if (this.elevator == true) {
                        return [ 
                            {
                                text: 'Move Elevator',
                                handler: this.handleMove
                            }, 
                            {
                                text: 'Remove Elevator',
                                handler: this.handleElevatorToggle
                            }, 
                            {
                                text: 'Change Direction',
                                handler: this.handleDirection
                            }
                        ];
                    } 
                    else {
                        if (this.rem_elevators > 0) {
                            return [{
                                text: 'Add Elevator',
                                handler: this.handleElevatorToggle
                            }];
                        } 
                    }
                }
                return [];
            }
        },
        methods: {
            handleCancel() {
                this.$emit('cancel');
            },
            handleMove() {
                this.$emit('move-elevator');
            },
            handleElevatorToggle() {
                this.$emit('toggle-elevator');
            },
            handleDirection() {
                this.$emit('toggle-direction')
            }
        }
    }
</script>

<style scoped>
    .cell-option {
        margin: auto;
        width: 100%;
        margin-top: 1vh;
        margin-bottom: 1vh;
        height: 6vh;
        font-size: 2vh;
        background-color: white;
        box-shadow: 0vh .2vh .5vh gray;
        border-radius: 1vh;
        color: black;
        border: none;
    }

    .cell-option:hover {
        color: black;
        box-shadow: none;
        margin-top: 1.2vh;
        margin-bottom: 0.8vh;

    }
</style>
