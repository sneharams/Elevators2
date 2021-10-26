<template>
    <form class="box">
        <label>Content:</label>
        <textarea v-model="content"/>
        <div :style="{visibility: message.length>0 ? 'visible' : 'hidden'}">
            {{ message }}
        </div>
        <div>
            <input class="close formbutton" type="button" v-on:click="closeHandler" value="x"/>
            <input class="submit formbutton" type="button" v-on:click="submitHandler" value="Submit"/>
        </div>
    </form>
</template>

<script src="../../public/services.js"></script>
<script>
    export default {
        name: 'CreateFreetForm',
        data() {
            return {
                content: '',
                message: ''
            }
        },
        methods: {
            closeHandler() {
                this.$emit("close");
                this.content = '';
                this.message = '';
            },
            submitHandler() {
                const fields = {
                    content: this.content
                };
                createFreet(fields, this.success, this.error);
            },
            success(obj) {
                this.$emit('success', obj);
                this.closeHandler();
            },
            error(obj) {
                this.message = obj.data.error;
            }
        }
    }
</script>

<style scoped>



    .form {
        display: flex;
        justify-content: flex-end;
    }

    .box {
        z-index: 20;
        position: relative;
        font-weight: bold;
        color: White;
        background-color: var(--blue);
        width: 400px;
        padding-top: 5px;
        right: 290px;
    }

    .box > * {
        margin-top: 10px;
        margin-left: 10px;
        width: 380px;
        display: inline-flex;
        justify-content: space-between;
    }

    .box > :last-child {
        margin-top: 10px;
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