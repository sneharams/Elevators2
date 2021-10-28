<template>
    <li class="contentbox"> 
            <span class="header">    
                <div class="author">
                    <button v-bind:class="authorClass" class="tooltip" v-on:click="followHandler">
                        <img class="icon" src="../assets/profile.png"/>
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
            <ParentFreet 
                v-if="parentID"
                v-bind:author="parent.author"
                v-bind:content="parent.content"
                v-bind:id="parent.id"
                v-bind:user="user"
                v-bind:followed="followed"
                v-on:error="error"
                v-on:success="freetSuccess"
            />
            <div class="error" :style="{visibility: errorVis}">{{message}}</div>
            <div v-bind:class="editorClass">
                <section class="editHeader">
                <label> {{ inputTitle }}</label>
                    <div class="editOptions">
                        <input type="button" value="Cancel" v-on:click="cancelHandler"/>
                        <input type="button" :value="submitValue" v-on:click="submitHandler"/>
                    </div>
                </section>
                <textarea v-model="content"/>
                
            </div>
            <div v-bind:class="actionsClass">
                <h4 class="votes">
                    <!-- update to be dynamic with upvotes on actual freet-->
                    {{ freet.upvotes }}
                </h4>
                <input
                    class="voteButton"
                    type="button"
                    value="Upvote"
                    v-bind:class="voteClass"
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

<script src="../../public/services.js"></script>
<script>
    import ParentFreet from './ParentFreet.vue';
    export default {
        name: 'Freet',
        props: ['freet', 'user', 'followed', 'parentID', 'upvotes'],
        components: {ParentFreet},
        data() {
            return {
                content: '',
                isEditing: false,
                message: '', // holds error
                optionsOpen: false,
                voteClass: 'unvoted',
                authorClass: 'notFollowed',
                isFollowing: 'Not Following',
                editorClass: 'hidden',
                actionsClass: 'actions',
                inputTitle: 'Edit Content',
                submitHandler: this.editSubmit,
                submitValue: 'Update',
                parent: {
                    id: null,
                    content: null,
                    author: null
                }
            }
        },
        watch: {
            parentID: function() {
                if (this.parentID) {
                    const fields = {
                        id: this.parentID
                    };
                    viewFreetByID(fields, this.parentSuccess, this.parentError);
                } else {
                    this.parent = null;
                }
            },
            followed: function() {
                if (this.followed.includes(this.freet.author)) {
                    this.authorClass= 'followed';
                    this.isFollowing='Following';
                } else {
                    this.authorClass= 'notFollowed';
                    this.isFollowing='Not Following';
                }
            },
            upvotes: function() {
                if (this.upvotes.includes(this.freet.id)) {
                    this.voteClass = 'upvoted';
                } else {
                    this.voteClass = 'unvoted';
                }
            },
            isEditing: function() {
                if (this.isEditing) {
                    this.editorClass = 'editor';
                    this.actionsClass = 'hidden';
                } else {
                    this.editorClass = 'hidden';
                    this.actionsClass = 'actions';
                }
            },
            inputTitle: function() {
                if (this.inputTitle == 'Edit Content') {
                    this.submitHandler = this.editSubmit;
                    this.submitValue = 'Update';
                } else {
                    this.submitHandler = this.refreetSubmit;
                    this.submitValue = 'Post';
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
                return this.message.length>0 ? 'visible' : 'hidden';
            },
        },
        beforeMount() {
            if (this.followed.includes(this.freet.author)) {
                this.authorClass= 'followed';
                this.isFollowing='Following';
            } else {
                this.authorClass= 'notFollowed';
                this.isFollowing='Not Following';
            }
            if (this.parentID) {
                const fields = {
                    id: this.parentID
                };
                viewFreetByID(fields, this.parentSuccess, this.parentError);
            } else {
                this.parent = null;
            }
            if (this.upvotes.includes(this.freet.id)) {
                this.voteClass = 'upvoted';
            } else {
                this.voteClass = 'unvoted';
            }
        },
        methods: {
            // event/state handlers
            cancelHandler() {
                this.content = '';
                this.message = '';
                this.isEditing = false;
            },
            deleteHandler() {
                const fields = {
                    id: this.freet.id
                }
                deleteFreet(fields, this.deleteSuccess, this.error);
            },
            editHandler() {
                this.optionsHandler();
                this.inputTitle = "Edit Content"
                this.content = this.freet.content;
            },
            followHandler() {
                const fields = {
                    author: this.freet.author
                }
                if (this.isFollowing == "Following") {
                    removeAuthorFromFollowed(fields, this.followSuccess, this.error);
                } else {
                    addAuthorToFollowed(fields, this.followSuccess, this.error);
                }
            },
            optionsHandler() {
                this.optionsOpen = !this.optionsOpen;
                this.message = '';
            },
            refreetHandler() {
                this.inputTitle = 'Add Comment';
                this.content = '';
                this.textHandler();
            },
            textHandler() {
                this.isEditing = true;
            },
            upvoteHandler() {
                const fields = {
                    id: this.freet.id,
                };
                if (!this.upvotes.includes(this.freet.id)) { 
                    this.voteClass = 'upvoted';
                    upvoteFreet(fields, this.voteSuccess, this.error);
                } else {
                    this.voteClass = 'unvoted';
                    unvoteFreet(fields, this.voteSuccess,this.error)
                }
            },
            // form submitting
            editSubmit() {
                const fields = {
                    id: this.freet.id,
                    content: this.content
                };
                editFreet(fields, this.editSuccess, this.error);
            },
            refreetSubmit() {
                const fields = {
                    id: this.freet.id,
                    content: this.content
                };
                refreetFreet(fields, this.freetSuccess, this.error);
            },
            // success callbacks
            deleteSuccess(obj) {
                //update to do something about refreets
                this.optionsHandler();
                this.$emit('delete', obj);
            },
            editSuccess(obj) {
                this.message = '';
                this.$emit('edit', obj);
                this.cancelHandler();
            },
            followSuccess(obj) {
                this.message = '';
                this.$emit('updateFollowed', obj);
            },
            freetSuccess(obj) {
                const message = obj.data.msg;
                const freets = obj.data.freets;
                this.$emit('success', message, freets);
                this.cancelHandler();
            },
            parentSuccess(obj) {
                this.message = '';
                this.parent = obj.data.freets[0];
            },
            voteSuccess(obj) { 
                this.message = '';
                this.$emit('vote', obj) 
            },
            // error callbacks
            error(obj) {
                this.message = obj.data.error;
            },
            parentError(obj) {
                this.parent = {
                    author: null,
                    content: null,
                    id: this.parentID,
                }  
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

    .visParent {
        visibility: visible;
        height: 20px;
        background-color: var(--darkblue);
    }

    .visParent:hover {
        background-color: var(--blue);
    }

    .hidParent {
        visibility: hidden;
        height: 0px;
    }

    .editor {
        height: 150px;
    }

    .hidden {
        visibility: hidden;
        height: 0px;
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
        margin-top: 6px;
        padding-top: 8px;
        margin-right: -6px;
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
    margin-left: 0px;
}

.contentbox {
    margin-left: auto;
    margin-right: auto;
    padding: 2%;
    max-width: 800px;
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

.upvoted {
    background-color: var(--blue) !important;
}

.unvoted {
    background-color: var(--darkblue) !important;
}

.unvoted:hover, .upvoted:hover {
    background-color: var(--offblue) !important;
}

input {
    border: none;
    height: 34px;
}

input[type="button"] {
    background-color: var(--blue);
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