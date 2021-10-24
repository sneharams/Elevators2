<template>
    <form>
        <input type="button" v-on:click="usernameHandler" value="Change Username"/>
        <input type="button" v-on:click="passwordHandler" value="Change Password"/>
        <input type="button" v-on:click="deleteHandler" value="Delete Account"/>
        <input type="button" v-on:click="closeHandler" value="x"/>
    </form>
</template>

<script>
    export default {
        name: 'AccountSettings',
        methods: {
            usernameHandler() {
                this.$emit("usernameForm");
            },
            passwordHandler() {
                this.$emit("passwordForm");
            },
            deleteHandler() {
                this.$emit("delete");
            },
            closeHandler() {
                this.$emit("close");
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
        background-color: var(--lightblue);
    }

    form {
        --darkblue:  #3973ac;
        --blue:      #6699cc;
        --lightblue: #9fbfdf;
        font-weight: bold;
        color: White;
        background-color: var(--blue);
        width: 160px;
        margin-right: -5px;
        padding-top: 5px;
    }

    form > * {
        margin-top: 10px;
        margin-left: 10px !important;
        width: 140px;
    }

    form > :last-child {
        width: 34px;
        margin-bottom: 10px;
        margin-left: 63px !important;
        padding-top: 4px;
        padding-bottom: 5px;
    }

    label {
        margin-top: auto;
        margin-bottom: auto;
    }

</style>