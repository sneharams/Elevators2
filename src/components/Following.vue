<template>
    <nav class="following">
        <h3> Following </h3>
        <section v-bind:class="vis"> {{ message }} </section>
        <div :style="{visibility: vis}">
            <input type="button" value="All Following" v-on:click="allHandler"/>
            <AuthorButton
                v-for="author in authors"
                v-bind:author="author"
                v-bind:key="author"
                v-on:authorHandler="authorHandler"
            />
        </div>
    </nav>
</template>

<script src="../javascripts/services.js"></script>
<script>
    import AuthorButton from './AuthorButton.vue';
    export default {
        name: 'Following',
        props: ['isLoggedIn', 'vis', 'user', 'authors'],
        components: {AuthorButton},
        data() {
            return {
                freets: [],
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
            },
            allHandler() {
                const fields = {};
                viewFreetsByFollowedAuthors(fields, this.success, this.error);
            },
            success(obj) {
              console.log('freet options hi');
              let freets = [];
              // create properties for each freet
              for (let [key, value] of Object.entries(obj.data.freets)) {
                  freets.push({
                      id: value.id,
                      content: value.content,
                      author: value.author
                  });
              };
              // sort freets by id (greatest -> smallest), so most recent freets displayed first
              freets.sort((a, b) => (parseInt(a.id) < parseInt(b.id)) ? 1 : -1);
              this.$emit('freetHandler', obj.data.msg, freets);
            },
            error(obj) {
              const message = ["Error",obj.status,obj.statusText,"-",obj.data.error].join(' ');
              this.$emit('errorHandler', message);
            }
        }
    }
</script>

<style scoped>
    nav {
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
