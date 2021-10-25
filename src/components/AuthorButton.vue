<template>
    <input type="button" :value="author" v-on:click="clickHandler" />
</template>

<script>
export default {
    name: 'AuthorButton',
    props: ['author'],
    methods: {
        clickHandler() {
            this.$emit('authorHandler', this.author);
        }
    }
}
</script>
