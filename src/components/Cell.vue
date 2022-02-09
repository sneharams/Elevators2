<template>
    <div class="cell" :class="cell_class" v-on:click="handleClick">
        <img 
            v-if="is_up == true" 
            class="cell-item" 
            :class="elevator_class" 
            src="../assets/elevator_up.png"
        />
        <img 
            v-if="is_up == false"
            class="cell-item" 
            :class="elevator_class" 
            src="../assets/elevator_down.png"
        />
    </div>
</template>

<script>
    export default {
        name: 'Cell',
        props: ['r', 'c', 'is_active', 'elevator', 'is_up'],
        data() {
            return {
                
            }
        },
        computed: {
            cell_class: function() {
                if (this.is_active == true) {
                    return 'cell-active';
                }
                return 'cell-inactive';
            },
            elevator_class: function() {
                if (this.elevator == true) {
                    return 'active';
                } else {
                    return 'inactive';
                }
            }
        },
        methods: {
            handleClick() {
                this.$emit('toggle-active', this.r, this.c);
            }
        },
    }
</script>

<style scoped>
    .cell {
        width: 100px;
        max-width: 15vh;
        height: 100px;
        max-height: 15vh;
        padding: 0px;
        margin: 2px;
    }

    .cell-inactive {
        background-color: lightgray;
    }

    .cell-inactive:hover {
        outline: solid 2px palegreen;
        background-color: gainsboro;
    }

    .cell-active {
        outline: solid 2px rgb(251, 187, 152);
        background-color: gainsboro;
    }

    .cell-item {
        width:100px;
        max-width: 15vh;
        height: 100px;
        max-height: 15vh;
    }

    .active {
        opacity: 100%;
    }

    .inactive {
        opacity: 0%;
    }

    .option {
        opacity: 20%;
    }
</style>