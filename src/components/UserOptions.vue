<template>
    <section class="optionsSection">
        <div class="userOptions">
            <div class="profile" :style="{visibility: vis}">
                <img class="icon" src="../assets/profile.png" />
                <div class="name"> {{ user }} </div>
            </div>
            <div v-bind:class="button1">
                <input 
                    type="button" 
                    v-on:click="clickHandler1" 
                    :value="button1Value"
                />
                <div/>
            </div>
            <div v-bind:class="button2">
                <input 
                    type="button" 
                    v-on:click="clickHandler2" 
                    :value="button2Value"
                />
                <div/>
            </div>
        </div>
        <div class="form" :style="{visibility: form}">
            <component 
                :is="dropdown"
                ref="form"
                v-on="{credentials: credentialsHandler,close: closeHandler,username: usernameHandler,password: passwordHandler, usernameForm: usernameFormHandler, passwordForm: passwordFormHandler, delete: deleteHandler}"
                v-bind:message="message"
                v-bind:username="username"
            ></component>
        </div>
    </section>
</template>

<script src="../javascripts/services.js"></script>
<script>
    import CredentialsForm from './CredentialsForm.vue';
    import UsernameForm from './UsernameForm.vue';
    import PasswordForm from './PasswordForm.vue';
    import AccountSettings from './AccountSettings.vue';
    export default {
        name: 'UserOptions',
        props: ['isLoggedIn', 'vis'],
        components: {
            CredentialsForm,
            UsernameForm,
            PasswordForm,
            AccountSettings
        },
        data () {
            return {
                button1: 'closedForm',
                button2: 'closedForm',
                form: 'hidden',
                username: '',
                user: '',
                message: '',
                dropdown: CredentialsForm,
            }
        },
        computed: {
            button1Value: function() {
                return this.isLoggedIn ? 'Sign Out' : 'Sign In';
            },
            button2Value: function() {
                return this.isLoggedIn ? 'Account Settings' : 'Create Account';
            }
        },
        mounted () {
            if (localStorage.user) {
                this.user = localStorage.user;
                this.$emit("sessionHandler", true, null, this.user);
            }
        },
        methods: {
            clickHandler1() {
                this.dropdown = CredentialsForm;
                if (!this.isLoggedIn) {
                    if (this.form == 'hidden' || this.button2 == 'openForm') {
                    this.dropdown = CredentialsForm;
                    this.$refs.form.closeHandler();
                    this.form = 'visible';
                    this.button1 = 'openForm';
                    this.button2 = 'closedForm'
                    } else {
                        this.$refs.form.closeHandler();
                        this.button1 = 'closedForm';
                    }
                } else {
                    const fields = {};
                    signOut(fields, this.signedOut, this.sessionError);
                }
            },
            clickHandler2() {
                if (!this.isLoggedIn) {
                    this.dropdown = CredentialsForm;
                } else {
                    this.dropdown = AccountSettings;
                }
                if (this.form == 'hidden' || this.button1 == 'openForm') {
                    this.dropdown = CredentialsForm;
                    this.$refs.form.closeHandler();
                    this.form = 'visible';
                    this.button2 = 'openForm';
                    this.button1 = 'closedForm'
                } else {
                    this.$refs.form.closeHandler();
                    this.button2 = 'closedForm';
                }
            },
            closeHandler() {
                this.form = 'hidden';
                this.message = '';
                this.button1 = 'closedForm';
                this.button2 = 'closedForm';
            },
            usernameFormHandler() {
                this.dropdown = UsernameForm;
            },
            passwordFormHandler() {
                this.dropdown = PasswordForm;
            },
            deleteHandler() {
                const fields = {};
                deleteUser(fields, this.deleted, this.sessionError);
            },
            credentialsHandler(fields) {
                this.username = fields.username;
                if (this.button1 == 'openForm') {
                    signIn(fields, this.signedIn, this.error);
                } else {
                    createUser(fields, this.created, this.error);
                }
            },
            usernameHandler(username) {
                this.username = username;
                const fields = {username: username};
                changeUsername(fields, this.signedIn, this.error);
            },
            passwordHandler(password) {
                const fields = {password: password};
                changePassword(fields, this.signedIn, this.error);
            },
            signedIn(obj) {
                this.user = this.username;
                console.log(this.user);
                localStorage.user = this.user;
                this.$emit("sessionHandler", true, obj.data, this.user);
                this.$refs.form.closeHandler();
            },
            signedOut(obj) {
                this.user = '';
                localStorage.user = this.user;
                this.$emit("sessionHandler", false, obj.data, this.user);
                this.$refs.form.closeHandler();
            },
            created(obj) {
                this.$emit("sessionHandler", false, obj.data, this.user);
                this.$refs.form.closeHandler();
            },
            // error to be displayed in main response area
            sessionError(obj) {
                if (obj.status==403) {
                    if (this.isLoggedIn) {
                        // logged out on server, but logged in on client-side
                        // update client-side to logged in
                        this.user = '';
                        this.$emit("sessionHandler", false, obj.data.error, this.user);
                    } else {
                        // logged out on client-side, but logged in on server
                        // update client-side to logged out
                        this.user = obj.data.user;
                        this.$emit("sessionHandler", true, obj.data.error, this.user);
                    }
                    this.closeHandler();
                } else {
                    this.$emit("sessionHandler", this.isLoggedIn, obj.data.error, this.user);
                }
            },
            // error to be displayed in top-right form
            // exception if error is 403
            error(obj) {
                if (obj.status==403) {
                    if (this.isLoggedIn) {
                        // logged out on server, but logged in on client-side
                        // update client-side to logged in
                        this.user = '';
                        this.$emit("sessionHandler", false, obj.data.error, this.user);
                    } else {
                        // logged out on client-side, but logged in on server
                        // update client-side to logged out
                        this.user = obj.data.user;
                        this.$emit("sessionHandler", true, obj.data.error, this.user);
                    }
                    this.closeHandler();
                } else {
                    this.username = '';
                    this.password = '';
                    this.message = obj.data.error;
                    this.$emit("sessionHandler", this.isLoggedIn, null, this.user);
                }
            },
            deleted(obj) {
                this.user = '';
                localStorage.user = this.user;
                this.$emit("sessionHandler", false, obj.data, this.user);
                this.closeHandler();
            }
        }
    }
</script>

<style scoped>

    .openForm input {
        border-radius: 4px 4px 0px 0px;
        background-color: var(--blue);
    }

    .openForm div {
        background-color: var(--blue);
        color: var(--blue);
        margin-left: 4px;
        margin-right: 4px;
        margin-top: -4px;
        height: 9px;
    }

    .closedForm input {
        border-radius: 4px 4px 4px 4px;
        background-color: var(--darkblue);
    }

    .closedForm div {
        visibility: 'hidden';
    }

    .optionsSection {
        display: flex;
        flex-direction: column;
    }

    input[type="button"]:hover {
        cursor: pointer;
        background-color: var(--blue) !important;
    }

    .userOptions {
        display: flex;
        justify-content: flex-end;
    }

    .form {
        margin-top: -4px;
        display: flex;
        justify-content: flex-end;
    }

    .button2 {
        width: 130px;
    }

    .formbutton {
        margin: 0px !important;
    }

    .formbutton:hover {
        background-color: var(--lightblue) !important;
    }

    .close {
        width: var(--stdheight);
        margin-right: 10px !important;
    }

    .profile {
        display: inline-flex;
    }

    .name {
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 5px;
        font-weight: bold;
        font-size: 20px;
        border-right: solid;
        border-width: 2px;
        border-color: gray;
        padding-right: 5px;
        padding-bottom: 1px;
    }

    .icon {
        width: 30px;
        height: 30px;
        margin-top: 8px;
        margin-bottom: 8px;
        margin-right: 5px;
    }
</style>