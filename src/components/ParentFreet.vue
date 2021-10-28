<template>
    <div class="borderbox" v-bind:class="overlay" v-on:click="parentHandler">
            <span class="header">    
                <div class="author">
                    <button v-bind:class="authorClass">
                        <img class="icon" src="../assets/profile.png"/>
                        {{ author }}
                        
                    </button>
                    <div v-if="author==null" class="placeholderShort"/>
                </div>
                <section class="end">
                    <div><h4 class="id">
                        {{ id }}
                    </h4></div>
                </section>
            </span>
            <div class="content">{{ content }}
                <div v-if="author==null" class="placeholderLong"/>
                <div v-if="author==null" class="placeholderLong"/>
                <div v-if="author==null" class="placeholderShort"/>
            </div>
    </div>
</template>

<script src="../../public/services.js"></script>
<script>
    export default {
        name: 'ParentFreet',
        props: ['author', 'content', 'id', 'user', 'followed'],
        data() {
            return {
                authorClass: 'notFollowedParent',
                overlay: 'dimmed'
            }
        },
        watch: {
            followed: function() {
                if (this.author) {
                    if (this.followed.includes(this.author)) {
                        this.authorClass= 'followedParent';
                    } else {
                        this.authorClass= 'notFollowedParent';
                    }
                } else {
                    this.authorClass= 'notFollowedParent';
                }
            },
            author: function() {
                this.overlay = this.author ? 'dimmed' : 'deleted';
            }
        },
        mounted() {
            this.overlay = this.author ? 'dimmed' : 'deleted';
        },
        methods: {
            parentHandler() {
                if (this.author) {
                    const fields = {
                        id: this.id
                    };
                    viewFreetByID(fields, this.success, this.error);
                }
            },
            success(obj) {
                this.$emit('success', obj);

            },
            error(obj) {
                this.$emit('error', obj);
            }
        }
    }
</script>

<style>

    .header {
        display: inline-flex;
        width: 100%;
        justify-content: space-between;
    }

    .end {
        display: inline-flex;
    }

    .followedParent {
        color: var(--darkblue);
    }

    .notFollowedParent {
        color: var(--std-color)
    }

    .id {
        margin-right: 5px;
    }

    .author {
        display: inline-flex;
        float: left;
        flex-grow: 1;
        height: 20px;
        margin-left: 5px;
    }

    .author div {
        margin-top: 2px;
    }

    h4 {
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .content {
        color: black;
        border-top: solid;
        border-width: 1px;
        padding-top: 10px;
        border-color: slategray;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
    }

    .borderbox {
        margin-left: auto;
        margin-right: auto;
        padding: 2%;
        border-radius: 6px;
        border: solid;
        border-color: var(--blue);
        background-color: var(--offblue);
        border-width: 2px;
        width: 90%;
        margin-top: 10px;
        margin-bottom: 10px;
    }


    header {
        height: 30px;
    }

    img {
        height: 16px;
        width: 16px;
    }

    .dimmed, .deleted {
        position: relative;
    }

    .dimmed:after {
        content: "Click to go to Freet";
        color: var(--std-color);
        font-weight: bold;
        text-align: center;
        padding-top: 15px;
        z-index: 10;
        display: block;
        position: absolute;
        height: calc(100% - 15px);
        top: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.5);
        visibility: hidden;
        opacity: 0;
        border-radius: 6px;
        pointer-events: none;
    }

    .dimmed:hover:after, .deleted:hover:after {
        visibility: visible;
        opacity: 1;
        transition: opacity .25s;
    }

    .deleted:after {
        content: "Freet was deleted";
        color: var(--std-color);
        font-weight: bold;
        text-align: center;
        padding-top: 15px;
        z-index: 10;
        display: block;
        position: absolute;
        height: calc(100% - 15px);
        top: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.5);
        visibility: hidden;
        opacity: 0;
        border-radius: 6px;
        pointer-events: none;
    }

    .placeholderShort {
        width: 100px;
        max-width: 90%;
        height: 16px;
        background-color: var(--darkblue);
    }

    .placeholderLong {
        width: 200px;
        max-width: 90%;
        height: 16px;
        background-color: var(--darkblue);
        margin-bottom: 5px;
    }
</style>