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

    .accountOptions {
        display: flex;
        flex-direction: column;
        z-index: 50;
        position: relative;
        font-weight: bold;
        color: White;
        background-color: var(--lightblue);
        width: 160px;
        margin-right: 6px;
        padding-top: 5px;
        box-shadow: 0px 2px 4px var(--darkblue);
        border-radius: 8px 0px 8px 8px;
        clip-path: inset(0px -4px -4px -4px);
    }

    .accountOptions > * {
        margin-top: 5px;
        margin-left: 10px !important;
        width: 140px;
        display: block;
        text-align: center !important;
    }

    .accountOptions > :last-child {
        width: 34px;
        margin-bottom: 5px;
        margin-left: 63px !important;
        padding-top: 4px;
        padding-bottom: 5px;
    }

    label {
        margin-top: auto;
        margin-bottom: auto;
    }

</style>