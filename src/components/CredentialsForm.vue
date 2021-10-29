<template>
    <form v-bind:class="credClass">
        <div>
            <label>Username</label>
            <input type="text" v-model="username">
        </div>
        <div>
            <label>Password</label>
            <input type="password" v-model="password">
        </div>
        <p class="error" v-if="message.length>0">
            {{ message }}
        </p>
        <div>
            <input class="close formbutton" type="button" v-on:click="closeHandler" value="x"/>
            <input class="submit formbutton" type="button" v-on:click="submitHandler" value="Submit"/>
        </div>
    </form>
</template>

<script>
    export default {
        name: 'CredentialsForm',
        props: ['message', 'credClass'],
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

    .error {
        padding: 5px !important;
        text-align: left !important;
        width: 370px !important;
    }

    input {
        border: none;
        height: 34px;
    }

    input[type="text"], input[type="password"] {
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
        margin-right: 6px;
        padding-top: 5px;
        box-shadow: 0px 2px 4px var(--darkblue);
        clip-path: inset(0px -4px -4px -4px);
    }

    .signIn {
        border-radius: 8px 8px 8px 8px;
    }

    .createAccount {
        border-radius: 8px 0px 8px 8px;
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