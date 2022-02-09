<template>
    <div>
        <div class="thread-button"
            v-for="chat in chats"
            v-bind:key="chat.floor"
        >
            {{chat.name}}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Chats',
        data() {
            return {
                chats: [ 
                    { 
                        name: 'Floor ?',
                        floor: 1
                    },
                    { 
                        name: 'Floor ?',
                        floor: 2
                    }
                ]
            };
        },
        computed: {
           
        },
        methods: {
           
        }
    }
</script>

<style scoped>
    .thread-button {
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

    .thread-button:hover {
        color: black;
        box-shadow: none;
        margin-top: 1.2vh;
        margin-bottom: 0.8vh;

    }
</style>
