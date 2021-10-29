<template>
    <input type="button" :value="authorName" v-on:click="clickHandler" />
</template>

<script>
export default {
    name: 'AuthorButton',
    props: ['author', 'authorName'],
    methods: {
        clickHandler() {
            this.$emit('authorHandler', this.author);
        }
    }
}
</script>
