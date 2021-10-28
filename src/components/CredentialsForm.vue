<template>
    <form>
        <div>
            <label>Username</label>
            <input type="text" v-model="username">
        </div>
        <div>
            <label>Password</label>
            <input type="text" v-model="password">
        </div>
        <div v-if="message.length>0">
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
        name: 'CredentialsForm',
        props: ['message'],
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            closeHandler() {
                this.username = '';
                this.password = '';
                this.$emit("close");
            },
            submitHandler() {
                const fields = {
                    username: this.username,
                    password: this.password
                };
                this.$emit("credentials", fields);
            },
        }
    }
</script>

<style scoped>

    input {
        border: none;
        height: 34px;
    }

    input[type="text"] {
        width: 290px;
        float: right;
        padding-left: 10px;
    }

    .form {
        display: flex;
        justify-content: flex-end;
    }

    form {
        z-index: 20;
        position: relative;
        font-weight: bold;
        color: var(--std-color);
        background-color: var(--lightblue);
        width: 400px;
        margin-right: -5px;
        padding-top: 5px;
        border-radius: 8px 8px 8px 8px;
    }

    form > * {
        margin-top: 10px;
        margin-left: 10px;
        width: 380px;
        display: inline-flex;
        justify-content: space-between;
    }

    form > :last-child {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    label {
        font-size: 14px;
        margin-top: auto;
        margin-bottom: auto;
    }

    .formbutton {
        margin: 0px !important;
    }

    .formbutton:hover {
        background-color: var(--offblue) !important;
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