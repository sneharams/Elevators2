<template>
    <form>
        <div>
            <label> New Password</label>
            <input type="password" v-model="password">
        </div>
        <p class="error" v-if="passIf">
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
        name: 'PasswordForm',
        props: ['message'],
        data() {
            return {
                password: '',
            }
        },
        computed: {
            passIf: function() {
                if (this.message && this.message.length > 0) {
                    return true;
                }
                return false;
            }
        },
        methods: {
            closeHandler() {
                this.password = '';
                this.$emit("close");
            },
            submitHandler() {
                this.$emit("changePassword", this.password);
            }
        }
    }
</script>

<style scoped>
    .error {
        padding: 5px !important;
        text-align: left !important;
        width: 410px !important;
    }

    input[type="password"] {
        width: 285px;
        float: right;
        padding-left: 10px;
    }

    .form {
        display: flex;
        justify-content: flex-end;
    }

    form {
        position: relative;
        z-index: 50;
        font-weight: bold;
        color: White;
        background-color: var(--lightblue);
        width: 440px;
        margin-right: 6px;
        padding-top: 5px;
        border-radius: 8px 0px 8px 8px;
        box-shadow: 0px 2px 4px var(--darkblue);
        clip-path: inset(0px -4px -4px -4px);
    }

    form > * {
        margin-top: 10px;
        margin-left: 10px;
        width: 420px;
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
        background-color: var(--offblue) !important;
    }

    .close {
        width: 34px;
        margin-right: 10px !important;
        padding-top: 4px !important;
        padding-bottom: 5px !important;
    }

    .submit {
        width: 376px;
    }
</style>