<template>
    <nav class="following">
        <h3> Following </h3>
        <section v-bind:class="vis"> {{ message }} </section>
        <div>
            <input v-if="followed.length>0" type="button" value="All Following" v-on:click="allHandler"/>
            <AuthorButton
                v-for="author in followed"
                v-bind:author="author"
                v-bind:authorName="author.username"
                v-bind:key="author.user_id"
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
        props: ['isLoggedIn', 'user', 'followed'],
        components: {AuthorButton},
        data() {
            return {
                message: 'Sign in to view Freets from authors you follow!',
                vis: 'visible'
            }
        },
        watch: {
            followed: function() {
                if (this.followed.length > 0) {
                    this.vis = 'hidden';
                } else {
                    this.vis = 'visible';
                    if (this.isLoggedIn) {
                        this.message = 'Click the usernames of authors on Freets to follow them!';
                        
                    } else {
                        this.message = 'Sign in to view Freets from authors you follow!';
                    }
                }
            },
        },
        mounted() {
            if (this.followed.length > 0) {
                this.vis = 'hidden';
            } else {
                this.vis = 'visible';
                if (this.isLoggedIn) {
                    this.message = 'Click the usernames of authors on Freets to follow them!';
                    
                } else {
                    this.message = 'Sign in to view Freets from authors you follow!';
                }
            }
        },
        methods: {
            authorHandler(author) {
                const fields = {
                    author_id: author.user_id
                };
                viewFreetsByAuthorID(fields, this.success, this.error);
                localStorage.lastCall = 'id';
                localStorage.author = author.user_id;
            },
            allHandler() {
                const fields = {};
                viewFreetsByFollowedAuthors(fields, this.success, this.error);
                localStorage.lastCall = 'all followed';
            },
            success(obj) {
                this.$emit('freetHandler', obj);
                const fields = {};
                getFollowedAuthors(fields, this.followSuccess, this.error);
            },
            followSuccess(obj) {
                const followed = obj.data.followed;
                const followedIDs = obj.data.followed_ids;
                this.$emit('followedHandler', followed, followedIDs);
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
        background-color: var(--offblue) !important;
    }

    .visible {
        text-align: center;
        color: lightgray;
    }

    .hidden {
        height: 0px;
        visibility: hidden;
    }

</style>
