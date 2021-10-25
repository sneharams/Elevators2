<template>
    <li class="contentbox"> 
        <span class="header">    
            <div class="author">
                <button v-bind:class="authorClass" class="tooltip" v-on:click="followHandler">
                    <img class="icon" src="../assets/profile.png"/>
                    <!-- update to make it clickable link to see author freets/follow -->
                    {{ freet.author }}
                    <span class="tooltiptext tooltiptextauthor"> {{ isFollowing }}</span>
                </button>
            </div>
            <section class="end">
                <div><h4 class="tooltip id">
                    <span class="tooltiptext tooltiptextid">ID</span>
                    {{ freet.id }}
                </h4></div>
                <div class="options" :style="{visibility: isAuthor}">
                    <input 
                        class="optionsButton"
                        type="button" 
                        value=":" 
                        v-on:click="optionsHandler"
                    />
                    <div class="optionItems" :style="{visibility: optionsVis}">
                        <!-- todo: create tooltip for why disabled -->
                        <input 
                            :disabled="edit ? true : false"
                            type="button" 
                            value="Edit" 
                            v-on:click="editHandler"
                        />
                        <input 
                            type="button" 
                            value="Delete" 
                            v-on:click="deleteHandler"
                        />
                    </div>
                </div>
            </section>
        </span>
        <div class="content">{{ freet.content }}</div>
        <div class="error" :style="{visibility: errorVis}">{{message}}</div>
        <div class="editor" :style="{visibility: editorVis, height: editorHeight}">
            <section class="editHeader">
            <label>Edit Content</label>
                <div class="editOptions">
                    <input type="button" value="Cancel" v-on:click="cancelHandler"/>
                    <input type="button" value="Update" v-on:click="updateHandler"/>
                </div>
            </section>
            <textarea v-model="content"/>
            
        </div>
        <div class="actions">
            <h4 class="votes">
                <!-- update to be dynamic with upvotes on actual freet-->
                {{ upvotes }}
            </h4>
            <input
                class="voteButton"
                type="button"
                value="Upvote"
                :style="{backgroundColor: upvoteColor}"
                v-on:click="upvoteHandler"
            />
            <input
                type="button"
                value="Refreet"
                v-on:click="refreetHandler"
            />
        </div>
    </li>
</template>

<script src="../javascripts/services.js"></script>
<script>
    export default {
        name: 'Freet',
        props: ['freet', 'user', 'followed'],
        data() {
            return {
                content: '',
                isEditing: false,
                edit: false, // update
                message: '', // holds error
                optionsOpen: false,
                upvotes: 0, // make property under freet
                upvoteColor: '#3973ac',
                authorClass: 'notFollowed',
                isFollowing: 'Not Following',
                editorVis: 'hidden',
                editorHeight: '0px'
            }
        },
        watch: {
            followed: function() {
                console.log(this.followed);
                if (this.followed.includes(this.freet.author)) {
                    this.authorClass= 'followed';
                    this.isFollowing='Following';
                } else {
                    this.authorClass= 'notFollowed';
                    this.isFollowing='Not Following';
                }
            },
            isEditing: function() {
                if (this.isEditing) {
                    this.editorVis = 'visible';
                    this.editorHeight = '150px';
                } else {
                    this.editorVis = 'hidden';
                    this.editorHeight = '0px';
                }
            }
        },
        computed: {
            isAuthor: function() {
                return this.user==this.freet.author ? 'visible' : 'hidden'
            },
            optionsVis: function() {
                return this.optionsOpen ? 'visible' : 'hidden';
            },
            errorVis: function() {
                return this.message.length>0 ? 'visible' : 'hidden'
            }
        },
        mounted() {
            if (this.followed.includes(this.freet.author)) {
                this.authorClass= 'followed';
                this.isFollowing='Following';
            } else {
                this.authorClass= 'notFollowed';
                this.isFollowing='Not Following';
            }
        },
        methods: {
            optionsHandler() {
                // update to prevent editing if upvotes/refreet
                this.optionsOpen = !this.optionsOpen;
                this.message = '';
            },
            editHandler() {
                console.log(this.isEditing);
                this.optionsHandler();
                this.content = this.freet.content;
                this.isEditing = true;
                console.log(this.isEditing);
            },
            cancelHandler() {
                this.content = '';
                this.error = '';
                this.isEditing = false;
            },
            updateHandler() {
                const fields = {
                    id: this.freet.id,
                    content: this.content
                };
                editFreet(fields, this.edited, this.error);
            },
            deleteHandler() {
                const fields = {
                    id: this.freet.id
                }
                deleteFreet(fields, this.deleted, this.error);
            },
            followHandler() {
                const fields = {
                    author: this.freet.author
                }
                if (this.isFollowing) {
                    removeAuthorFromFollowed(fields, this.follow, this.error);
                } else {
                    addAuthorToFollowed(fields, this.follow, this.error);
                }
                
            },
            upvoteHandler() {
                // update to actually function outside of client screen
                if (this.upvoteColor == '#3973ac') {
                    this.upvoteColor = '#6699cc';
                    this.upvotes += 1;
                } else {
                    this.upvoteColor = '#3973ac'
                    this.upvotes -= 1;
                }
            },
            refreetHandler() {
                // update to do something
            },
            follow(obj) {
                this.error = '';
                this.$emit('updateFollowed', obj);
            },
            edited(obj) {
                this.error = '';
                this.$emit('edit', obj);
                this.cancelHandler();
            },
            deleted(obj) {
                //update to do something about refreets
                this.optionsHandler();
                this.$emit('delete', obj);
            },
            error(obj) {
                this.message = obj.data.error;
            }
        }
    }
</script>

<style>

    li {
        background-color: var(--lightblue);
        margin: 10px;
    }

    .header {
        display: inline-flex;
        width: 100%;
        justify-content: space-between;
    }

    .end {
        display: inline-flex;
    }

    .options {
        width: 20px;
        height: 20px;
    }

    .optionsButton {
        height: 24px;
        width: 24px;
        margin: 0px !important;
        position: relative;
        top: -4px;
        /* margin-bottom: 10px !important; */
        border-radius: 15px;
        padding-top: 4px !important;
    }

    button {
        background-color: transparent;
        outline: none;
        border: none;
        font-weight: bold;
        font-size: 16px;
    }

    .followed {
        color: var(--darkblue);
    }

    .followed:hover {
        color: var(--std-color);
    }

    .notFollowed {
        color: var(--std-color)
    }

    .notFollowed:hover {
        color: var(--darkblue);
    }

    .id {
        margin-right: 5px;
    }

    .actions {
        width: 100%;
        justify-content: flex-end;
        display: inline-flex;
    }

    .votes {
        background-color: var(--blue);
        height: 26px;
        text-align: center;
        padding-left: 10px;
        padding-right: 10px;
        margin-top: 4px;
        padding-top: 8px;
        margin-right: -4px;
        border-right: solid;
        border-color: var(--darkblue);
        min-width: 14px;
        color: white;
        border-radius: 4px 0px 0px 4px
    }

    textArea {
        width: 100%;
        padding: 0px;
        height: 100px;
    }

    .editHeader {
        margin-top: 10px;
        display: inline-flex;
        width: 100%;
        justify-content: space-between;
    }

    .editOptions > *{
        height: 30px;
        padding-top: 8px !important;
        margin-right: 0px !important;
        margin-bottom: 0px !important;
    }
    
.author {
  display: inline-flex;
  float: left;
  flex-grow: 1;
  height: 20px;
  margin-left: 5px;
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
}

.voteButton {
    border-radius: 0px 4px 4px 0px;
}

.contentbox {
  padding: 2%;
}


/* for tooltips clarifying what text is author and what is ID */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted gray;
}

.tooltip .tooltiptextid {
  visibility: hidden;
  margin-left: -15px;
  background-color: gray;
  font-size: 10px;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  right: 100%;
  margin-right: 5px;
  margin-top: -2px;
  opacity: 0;
  transition: opacity 1s;
}

.tooltip .tooltiptextauthor {
  background-color: gray;
  font-size: 10px;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  visibility: hidden;
  left: 100%;
  top: 10%;
  margin-top: -2px;
  margin-left: 5px;
  opacity: 0;
  transition: opacity 1s;
}

.tooltip .tooltiptextid::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 100%;
  margin-top: -4px;
  border-width: 3px;
  border-style: solid;
  border-color: transparent transparent transparent gray;
}

.tooltip .tooltiptextauthor::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -4px;
  border-width: 3px;
  border-style: solid;
  border-color: transparent gray transparent transparent;
}

.tooltip:hover .tooltiptextid {
  visibility: visible;
  opacity: 1;
}

.tooltip:hover .tooltiptextauthor {
  visibility: visible;
  opacity: 1;
}

.message {
  padding-left: 3.5%;
}


    input {
        border: none;
        height: 34px;
    }

    input[type="button"] {
        background-color: var(--darkblue);
        color: white;
        padding: 10px;
        margin: 4px;
        font-weight: bold;
    }

    input[type="button"]:focus {
        outline: none;
    }

    input[type="button"]:hover {
        cursor: pointer;
        background-color: var(--blue);
    }

    input[type="button"]:disabled {
        background-color: gray;
    }

    input[type="text"] {
        width: 285px;
        float: right;
        padding-left: 10px;
    }

    header {
        height: 30px;
    }

    img {
        height: 16px;
        width: 16px;
    }

    form > * {
        margin-top: 10px;
        margin-left: 10px;
        width: 380px;
        display: inline-flex;
        justify-content: space-between;
    }

    form > :last-child {
        margin-bottom: 10px;
    }

    label {
        margin-top: auto;
        margin-bottom: auto;
    }

    .formbutton {
        margin: 0px !important;
    }

    .formbutton:hover {
        background-color: var(--lightblue) !important;
    }

    .close {
        width: 34px;
        margin-right: 10px !important;
        padding-top: 4px !important;
        padding-bottom: 5px !important;
    }

    .submit {
        width: 346px;
    }
</style>