<template>
    <form class="accountOptions">
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

    input[type="button"]:focus {
        outline: none;
    }

    input[type="button"]:hover {
        cursor: pointer;
        background-color: var(--lightblue);
    }

    .accountOptions {
        display: flex;
        flex-direction: column;
        z-index: 20;
        position: relative;
        font-weight: bold;
        color: White;
        background-color: var(--blue);
        width: 160px;
        margin-right: -5px;
        padding-top: 5px;
    }

    .accountOptions > * {
        margin-top: 10px;
        margin-left: 10px !important;
        width: 140px;
    }

    .accountOptions > :last-child {
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