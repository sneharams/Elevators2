<template>
    <nav class="following">
        <h3> Following </h3>
        <section v-bind:class="vis"> {{ message }} </section>
        <div :style="{visibility: vis}">
            <input type="button" value="All Following" v-on:click="allHandler"/>
            <AuthorButton
                v-for="author in followed"
                v-bind:author="author"
                v-bind:key="author"
                v-on:authorHandler="authorHandler"
            />
        </div>
    </nav>
</template>

<script src="../../public/services.js"></script>
<script>
    import AuthorButton from './AuthorButton.vue';
    export default {
        name: 'Following',
        props: ['isLoggedIn', 'vis', 'user', 'followed'],
        components: {AuthorButton},
        data() {
            return {
                message: 'Sign in to view freets from authors you follow!',
            }
        },

        methods: {
            authorHandler(author) {
                const authorText = author;
                const fields = {
                    author: authorText
                }
                viewFreetsByAuthor(fields, this.success, this.error);
                localStorage.lastCall = 'author';
                localStorage.author = authorText;
            },
            allHandler() {
                const fields = {};
                viewFreetsByFollowedAuthors(fields, this.success, this.error);
                localStorage.lastCall = 'all followed';
            },
            success(obj) {
                this.$emit('freetHandler', obj);
            },
            error(obj) {
                this.$emit('errorHandler', obj);
            }
        }
    }
</script>

<style scoped>
    nav {
        border-top: solid;
        border-color: var(--blue);
        width: 140px;
        padding: 10px;
        background-color: var(--darkblue);
        height: calc(100%-20px);
    }

    h3 {
        width: 140px;
        text-align: center;
        color: white;
        margin-top: 10px;
        margin-bottom: 4px;
        padding-bottom: 4px;
        border-bottom: solid;
    }

    input {
        width: 140px;
        margin-left: 0px !important;
        margin-right: 0px !important;
        background-color: var(--blue) !important;
    }

    input:hover {
        background-color: var(--lightblue) !important;
    }

    .hidden {
        text-align: center;
        color: lightgray;
    }

    .visible {
        height: 0px;
        visibility: hidden;
    }

</style>
