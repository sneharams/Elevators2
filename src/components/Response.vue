<template>
    <section class="response">
        <h2 class="message">{{ response.message }}</h2>
        <ol class="freets" v-bind:class="{scrollbox: response.freets.length>0}">
            <Freet 
                v-for="freet in response.freets"  
                v-bind:freet="freet"
                v-bind:user="user" 
                v-bind:key="freet.id"
                v-bind:followed="followed"
                v-on:edit="editHandler"
                v-on:delete="deleteHandler"
                v-on:updateFollowed="followedHandler"
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
            }
        }
    }
</script>

<style scoped>
    .response {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    ol {
        list-style-type: none;
    }

    h2 {
        margin-bottom: 10px;
    }

    .scrollbox {
        flex-grow: 1;
        padding-left: 20px;
        padding-right: 20px;
        margin: 0px;
        width: calc(100% - 40px);
        overflow-x: hidden;
    }
</style>