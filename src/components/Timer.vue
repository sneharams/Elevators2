<template>
    <div class="timer" :class="timer_class">
        {{ time_rem }}
        <br>
        <input type="button" value="Start/Stop" v-on:click="handleToggle"/>
        <input type="button" value="Reset" v-on:click="reset"/>
    </div>
</template>


<script>
    export default {
        name: 'Timer',
        data() {
            return {
                timer: 0,
                time_rem: 0,
                timer_class: 'timer-stopped',
            }
        },
        created() {
            this.timer = setInterval(this.update, 1000);
        },
        methods: {
            handleToggle() {
                if (this.timer_class == 'timer-stopped') {
                    this.start();
                } else {
                    this.stop();
                }
            },
            start() {
                this.timer_class = 'timer-running';
                this.timer = setInterval(this.update, 1000);
            },
            stop() {
                this.timer_class = 'timer-stopped';
                clearInterval(this.timer);
            },
            reset() {
                this.time_rem = 240;
            },
            update() {
                if (this.time_rem > 0) {
                    this.time_rem -= 1;
                } else {
                    this.stop();
                }
                return this.time_rem;
            }
        }

    }

</script>


<style scoped>

    .timer {
        border: solid .1vh gray;
        font-size: 2vh;
        text-align: center;
    }

    .timer-stopped {
        border-color: red;
    }

</style>