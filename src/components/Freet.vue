<template>
    <li class="contentbox"> 
            <span class="header">    
                <div class="author">
                    <button v-bind:class="authorClass" class="tooltip" v-on:click="followHandler">
                        <img class="icon" src="../assets/profile.png"/>
                        {{ author }}
                        <span class="tooltiptext tooltiptextauthor"> {{ isFollowing }}</span>
                    </button>
                </div>
                <section class="end">
                    <div><h4 class="tooltip id">
                        <span class="tooltiptext tooltiptextid">ID</span>
                        {{ freet.id }}
                    </h4></div>
                    <div class="options" v-if="freet.author == user">
                        <input 
                            class="optionsButton"
                            v-bind:class="{optionsButtonOpen : optionsOpen}" 
                            type="button" 
                            :value="optionsButton" 
                            v-on:click="optionsHandler"
                        />
                        <div class="optionItems" v-if="optionsOpen">
                            <div/>
                            <input 
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
            <div class="content">{{ freetContent }} {{ edited }} </div>
            <ParentFreet 
                v-if="parentID"
                v-bind:author="parent.author"
                v-bind:content="parent.content"
                v-bind:edited="parent.edited"
                v-bind:id="parent.id"
                v-bind:user="user"
                v-bind:followed="followed"
                v-on:error="error"
                v-on:success="freetSuccess"
            />
            <div class="error" v-if="messageIf">{{message}}</div>
            <div class="editor" v-if="isEditing">
                <section class="editHeader">
                <label> {{ inputTitle }}</label>
                    <div class="editOptions">
                        <input type="button" value="Cancel" v-on:click="cancelHandler"/>
                        <input type="button" :value="submitValue" v-on:click="submitHandler"/>
                    </div>
                </section>
                <textarea v-model="content"/>
                
            </div>
            <div class="actions" v-if="!isEditing">
                <h4 class="votes">
                    <!-- update to be dynamic with upvotes on actual freet-->
                    {{ upvoteNum }}
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
        props: ['freet', 'author', 'freetContent', 'edited', 'upvoteNum', 'user', 'followed', 'parentID', 'upvotes'],
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
            },
        },
        computed: {
            optionsButton: function() {
                return this.optionsOpen ? 'x' : ':';
            },
            messageIf: function() {
                if (this.message && this.message.length > 0) {
                    return true;
                }
                return false;
            }
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
                this.textHandler();
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
                    edited: null
                }  
            }
        }
    }
</script>

<style>

    li {
        background-color: var(--lightblue);
        margin: 20px;
        border-radius: 8px;
        box-shadow: 0px 2px 4px var(--darkblue);
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
        width: 24px;
        height: 24px;
        display: flex;
        flex-direction: column;
    }

    .optionItems {
        position: relative;
        z-index: 30;
        width: 100px;
        height: 93px;
        right: calc(100px - 24px);
        display: flex;
        flex-direction: column;
        background-color: var(--lightblue);
        border-radius: 4px 0px 4px 4px;
        
    }

    .optionItems::before {
        position: absolute;
        content: '';
        background-color: var(--blue);
        border-radius: 4px 0px 4px 4px;
        z-index: -1;
        width: 100px;
        height: 93px;
        filter: drop-shadow(0px 2px 2px var(--darkblue));
        clip-path: polygon(-4px -4px, 76px -4px, 76px 6px, 104px 6px, 104px 100px, -4px 100px);
    }

    .optionItems div {
        position: absolute;
        z-index: -31;
        top: -24px;
        left: calc(100px - 24px);
        width: 24px;
        height: 30px;
        background-color: var(--blue);
        box-shadow: 0px 2px 4px var(--darkblue);
        border-radius: 12px 12px 0px 0px;
        clip-path: inset(0px -4px 0px -4px);
    }

    .optionsButton {
        height: 24px;
        width: 24px;
        margin: 0px !important;
        position: relative;
        z-index: 31;
        border-radius: 15px;
        padding-top: 4px !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
    }

    .optionsButtonOpen {
        background-color: var(--blue) !important;
    }

    .optionsButtonOpen:hover {
        background-color: var(--offblue) !important;
    }

    button {
        background-color: transparent;
        outline: none;
        border: none;
        font-weight: bold;
        font-size: 16px;
    }

    .editor {
        height: 150px;
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
        margin-top: 2px;
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
        border-radius: 4px 4px 0px 0px !important;
    }
    
    .author {
        display: inline-flex;
        float: left;
        flex-grow: 1;
        height: 20px;
        margin-left: 5px;
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
        margin-top: 4px;
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

</style>