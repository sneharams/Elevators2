<template>
    <section class="response">
        <h3 class="message">{{ response.message }}</h3>
        <ol class="freets" v-bind:class="{scrollbox: isScroll}">
            <Freet 
                v-for="freet in response.freets"  
                v-bind:freet="freet"
                v-bind:user="user" 
                v-bind:key="freet.id"
                v-bind:followed="followed"
                v-on:edit="editHandler"
                v-on:delete="deleteHandler"
                v-on:updateFollowed="followedHandler"
                v-on:success="successHandler"
            />
        </ol>
    </section>
</template>

<script>
    import Freet from './Freet.vue';
    export default {
        name: 'Response',
        components: {Freet},
        props: ['response', 'user', 'followed'],
        computed: {
            isScroll: function() {
                return this.response.freets.length>0;
            }
        },
        methods: {
            editHandler(obj) {
                this.$emit('edit', obj);
            },
            deleteHandler(obj) {
                this.$emit('delete', obj);
            },
            followedHandler(obj) {
                const authors = obj.data.followed;
                console.log(authors);
                this.$emit('followedHandler', authors);
            },
            successHandler(message, freets) {
                this.$emit('freetHandler', message, freets);
            }
        }
    }
</script>

<style scoped>
    .response {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        background-color: gainsboro;
    }

    ol {
        list-style-type: none;
        visibility: 'hidden';
    }

    h3 {
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 15px;
        padding-bottom: 10px;
        margin-top: 0px;
        margin-bottom: 0px;
        background-color: gray;
        color: white;
        text-align: center;
    }

    .scrollbox {
        visibility: visible;
        border-bottom: solid;
        border-bottom-width: 2vh;
        border-color: gray;
        background-color: gainsboro;
        flex-grow: 1;
        padding-left: 20px;
        padding-right: 20px;
        margin: 0px;
        width: calc(100% - 40px);
        overflow-x: hidden;
    }

    /* customize scrollbar for dark theme */
    ::-webkit-scrollbar {
        width: 2vh;  /* for vertical scrollbars */
        height: 2vh; /* for horizontal scrollbars */
    }
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
    }
</style>