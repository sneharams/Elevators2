<template>
    <section class="response">
        <div class="contentbox scrollbox">
            <h2 class="message">{{ response.message }}</h2>
            <ol class="freets">
                <Freet 
                    v-for="freet in response.freets"  
                    v-bind:freet="freet"
                    v-bind:user="user" 
                    v-bind:key="freet.id"
                    v-on:edit="editHandler"
                    v-on:delete="deleteHandler"
                />
            </ol>

        </div>
    </section>
</template>

<script>
    import Freet from './Freet.vue';
    export default {
        name: 'Response',
        components: {Freet},
        props: ['response', 'user'],
        methods: {
            editHandler(obj) {
                this.$emit('edit', obj);
            },
            deleteHandler(obj) {
                this.$emit('delete', obj);
            }
        }
    }
</script>

<style scoped>
    ol {
        list-style-type: none;
    }
</style>