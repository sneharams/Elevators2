<template>
    <form>
        <div>
            <label> New Password</label>
            <input type="text" v-model="username">
        </div>
        <div :style="{visibility: message.length>0 ? 'visible' : 'hidden'}">
            {{ message }}
        </div>
        <div>
            <input class="close formbutton" type="button" v-on:click="closeHandler" value="x"/>
            <input class="submit formbutton" type="button" v-on:click="submitHandler" value="Submit"/>
        </div>
    </form>
</template>

<script>
    export default {
        name: 'PasswordForm',
        props: ['message', 'password'],
        methods: {
            closeHandler() {
                this.$emit("close");
            },
            submitHandler() {
                this.$emit("changePassword", this.password);
            }
        }
    }
</script>

<style scoped>

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

    input[type="text"] {
        width: 285px;
        float: right;
        padding-left: 10px;
    }

    .form {
        display: flex;
        justify-content: flex-end;
    }

    form {
        --darkblue:  #3973ac;
        --blue:      #6699cc;
        --lightblue: #9fbfdf;
        font-weight: bold;
        color: White;
        background-color: var(--blue);
        width: 400px;
        margin-right: -5px;
        padding-top: 5px;
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