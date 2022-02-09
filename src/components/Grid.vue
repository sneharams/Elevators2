<template>
    <div class="floor">
        <div class="escape-container">
            <div class="fire-escape">
                <img class="escape" src="../assets/fire_escape.png">
            </div>
        </div>
        <div class="grid">
            <div class="row">
                <Cell
                    v-for="cell in cells[0]"
                    v-bind:key="cell.key"
                    v-bind:r="cell.r"
                    v-bind:c="cell.c"
                    v-bind:is_active="cell.active"
                    v-bind:elevator="cell.elevator"
                    v-bind:is_up="cell.elevator_up"
                    v-on:toggle-active="handleActiveToggle"
                />
            </div>
            <div class="row">
                <Cell
                    v-for="cell in cells[1]"
                    v-bind:key="cell.key"
                    v-bind:r="cell.r"
                    v-bind:c="cell.c"
                    v-bind:is_active="cell.active"
                    v-bind:elevator="cell.elevator"
                    v-bind:is_up="cell.elevator_up"
                    v-on:toggle-active="handleActiveToggle"
                />
            </div>
            <div class="row">
                <Cell
                    v-for="cell in cells[2]"
                    v-bind:key="cell.key"
                    v-bind:r="cell.r"
                    v-bind:c="cell.c"
                    v-bind:is_active="cell.active"
                    v-bind:elevator="cell.elevator"
                    v-bind:is_up="cell.elevator_up"
                    v-on:toggle-active="handleActiveToggle"
                />
            </div>
            <div class="row">
                <Cell
                    v-for="cell in cells[3]"
                    v-bind:key="cell.key"
                    v-bind:r="cell.r"
                    v-bind:c="cell.c"
                    v-bind:is_active="cell.active"
                    v-bind:elevator="cell.elevator"
                    v-bind:is_up="cell.elevator_up"
                    v-on:toggle-active="handleActiveToggle"
                />
            </div>
            <div class="row">
                <Cell
                    v-for="cell in cells[4]"
                    v-bind:key="cell.key"
                    v-bind:r="cell.r"
                    v-bind:c="cell.c"
                    v-bind:is_active="cell.active"
                    v-bind:elevator="cell.elevator"
                    v-bind:is_up="cell.elevator_up"
                    v-on:toggle-active="handleActiveToggle"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import Cell from './Cell.vue';

    export default {
        name: 'Grid',
        components: {Cell},
        props: ['cells'],
        methods: {
            handleActiveToggle(r, c) {
                this.$emit('toggle-active', r, c);
            }
        },
    }
</script>

<style scoped>

    .floor {
        width: fit-content;
        max-width: 100vw;
        margin: auto;
    }

    .escape-container {
        width: 100%;
        height: 100px;
        padding-bottom: 2px;
    }

    .fire-escape {
        width: fit-content;
        height: fit-content;
        margin-left: 119px;
        background-color: rgb(173, 54, 54);
        border: solid 4px darkred;
    }

    .escape {
        width: 204px;
        height: 100px;
    }

    .grid {

        border: solid 15px darkred;
        padding: 2px;
        background-color: white;
    }

    .row {
        display: flex;
        flex-direction: row;
    }
</style>
