<template>
    <section class="optionsSection">
        <div class="options">
            <img class="icon" :style="{visibility: user.length>0 ? 'visible' : 'hidden'}" src="../assets/profile.png" />
            <div class="profile" :style="{borderWidth: user.length>0 ? '2px' : '0px'}"> {{ user }} </div>
            <div>
                <input 
                    type="button" 
                    :style="{backgroundColor: button1.color}" 
                    v-on:click="clickHandler1" :value="isLoggedIn ? 'Sign Out' : 'Sign In'"
                />
                <div class="formconnector" :style="{visibility: button1.connector}"/>
            </div>
            <div>
                <input 
                    type="button" 
                    class="button2"
                    :style="{backgroundColor: button2.color}" 
                    v-on:click="clickHandler2" :value="isLoggedIn ? 'Account Settings' : 'Create Account'"
                />
                <div class="formconnector" :style="{visibility: button2.connector}"/>
            </div>
        </div>
        <div class="form" :style="{visibility: form}">
            <component 
                :is="dropdown"
                v-on="{credentials: credentialsHandler,close: closeHandler,username: usernameHandler,password: passwordHandler, usernameForm: usernameFormHandler, passwordForm: passwordFormHandler, delete: deleteHandler}"
                v-bind:message="message"
                v-bind:username="username"
                v-bind:password="password"
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
        props: ['isLoggedIn'],
        components: {
            CredentialsForm,
            UsernameForm,
            PasswordForm,
            AccountSettings
        },
        data () {
            return {
                button1: {
                    color: '#3973ac', // --darkblue
                    connector: 'hidden'
                },
                button2: {
                    color: '#3973ac', // --darkblue
                    connector: 'hidden'
                },
                form: 'hidden',
                username: '',
                user: '',
                darkblue: '#3973ac',
                blue: '#6699cc',
                message: '',
                dropdown: CredentialsForm
            }
        },
        mounted () {
            if (localStorage.user) {
                this.user = localStorage.user;
            }
        },
        methods: {
            clickHandler1() {
                if (!this.isLoggedIn) {
                    this.toggleButton1();
                    if (this.form == 'hidden') {
                        this.dropdown = CredentialsForm;
                        this.form = 'visible';
                    } else {
                        if (this.button2.connector == 'visible') {
                            this.dropdown = CredentialsForm;
                            this.toggleButton2();
                        } else {
                            this.form = 'hidden';
                        }
                    }
                } else {
                    const fields = {};
                    signOut(fields, this.signedOut, this.sessionError);
                }
            },
            clickHandler2() {
                this.toggleButton2();
                if (!this.isLoggedIn) {
                    if (this.form == 'hidden') {
                        this.dropdown = CredentialsForm;
                        this.form = 'visible';
                    } else {
                        if (this.button1.connector == 'visible') {
                            this.dropdown = CredentialsForm;
                            this.toggleButton1();
                        } else {
                            this.form = 'hidden';
                        }
                    }
                } else {
                    if (this.form == 'hidden') {
                        this.dropdown = AccountSettings;
                        this.form = 'visible';
                    } else {
                        this.form = 'hidden';
                    }
                }
            },
            closeHandler() {
                this.form = 'hidden';
                this.message = '';
                this.username = '';
                this.password = '';
                this.button1.connector = 'hidden';
                this.button2.connector = 'hidden';
                this.button1.color = this.darkblue;
                this.button2.color = this.darkblue;
            },
            toggleButton1() {
                if(this.button1.connector == 'visible') {
                    this.button1.connector = 'hidden';
                    this.button1.color = this.darkblue;
                } else {
                    this.button1.connector = 'visible';
                    this.button1.color = this.blue;
                }
            },
            toggleButton2() {
                if(this.button2.connector == 'visible') {
                    this.button2.connector = 'hidden';
                    this.button2.color = this.darkblue;
                } else {
                    this.button2.connector = 'visible';
                    this.button2.color = this.blue;
                }
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
                this.password = fields.password;
                if (this.button1.connector == 'visible') {
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
                localStorage.user = this.user;
                this.$emit("sessionHandler", true, obj.data, this.user);
                this.closeHandler();
            },
            signedOut(obj) {
                this.user = '';
                localStorage.user = this.user;
                this.$emit("sessionHandler", false, obj.data, this.user);
                this.closeHandler();
            },
            created(obj) {
                this.$emit("sessionHandler", false, obj.data, this.user);
                this.closeHandler();
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

    .optionsSection {
        display: flex;
        flex-direction: column;
    }
    
    

    input[type="button"]:hover {
        cursor: pointer;
        background-color: var(--blue);
    }

    .options {
        display: flex;
        justify-content: flex-end;
    }

    .form {
        display: flex;
        justify-content: flex-end;
    }

    .button2 {
        width: 130px;
    }

    .formconnector {
        background-color: var(--blue);
        color: var(--blue);
        margin-left: 4px;
        margin-right: 4px;
        margin-top: -4px;
        height: 9px;
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
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 5px;
        font-weight: bold;
        font-size: 20px;
        border-right: solid;
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