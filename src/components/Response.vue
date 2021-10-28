<template>
    <section class="response">
        <h4 class="message">
            {{ response.message }} 
            <form v-if="response.freets.length>1">
            <label class="sortlabel" for="types">Sort Freets By:</label>
                <select class="sortbar" v-model="selected">
                    <option v-for="option in options" v-bind:key="option.value" v-bind:value="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </form>
        </h4> 
        <ol class="freets" v-bind:class="{scrollbox: isScroll}">
            <Freet 
                v-for="freet in response.freets"  
                v-bind:freet="freet"
                v-bind:freetContent="freet.content"
                v-bind:edited="freet.edited"
                v-bind:author="freet.author"
                v-bind:upvoteNum="freet.upvotes"
                v-bind:user="user" 
                v-bind:key="freet.id"
                v-bind:parentID="freet.parent_id"
                v-bind:followed="followed"
                v-bind:upvotes="upvotes"
                v-on:edit="editHandler"
                v-on:delete="deleteHandler"
                v-on:updateFollowed="followedHandler"
                v-on:success="successHandler"
                v-on:vote="voteHandler"
            />
        </ol>
    </section>
</template>

<script>
    import Freet from './Freet.vue';
    export default {
        name: 'Response',
        components: {Freet},
        props: ['response', 'user', 'followed', 'upvotes'],
        data () {
            return {
                selected: 1,
                options: [
                    { text: 'Newest', value: 1 },
                    { text: 'Oldest', value: 2 },
                    { text: 'Most Upvoted', value: 3 },
                    { text: 'Least Upvoted', value: 4 }
                ]
            }
        },
        computed: {
            isScroll: function() {
                return this.response.freets.length>0;
            }
        },
        watch: {
            selected: function() {
                if (this.selected != 5) {
                    this.$emit('sort', this.selected);
                    this.options = this.options.filter(option => option.value != 5);
                }
            }
        },
        mounted() {
            this.$emit('sort', this.selected);
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
            voteHandler(obj) {
                this.options.push({text: 'Current', value: 5});
                this.selected = 5;
                this.$emit('vote', obj);
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
    }

    ol {
        list-style-type: none;
        visibility: 'hidden';
    }

    h4 {
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 15px;
        padding-bottom: 10px;
        margin-top: 0px;
        margin-bottom: 0px;
        background-color: #E5ECF5;
        color: var(--std-color);
        text-align: center;
    }

    .scrollbox {
        visibility: visible;
        border-bottom: solid;
        border-bottom-width: 2vh;
        border-color: #E5ECF5;
        flex-grow: 1;
        padding-left: 20px;
        padding-right: 20px;
        margin: 0px;
        width: calc(100% - 40px);
        overflow-x: hidden;
    }

    .sortlabel {
        width: fit-content;
    }

    .sortbar {
        height: 20px;
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