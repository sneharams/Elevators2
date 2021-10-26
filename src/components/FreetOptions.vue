<template>
    <span class="freetOptions">
        <input class="allButton" type="button" value="View All Freets" v-on:click="viewAllFreetsHandler"/>
        <div class="searchbox">
            <input class="search" type="text" v-model="searchText" v-on:focus="searchHandler"/>
            <input type="button" class="searchButton" value="Search" v-on:click="viewFreetsByAuthorHandler"/>
        </div>
        <div class="create" :style="{visibility: vis}">
            <input class="createbutton" type="button" value="Create Freet" v-on:click="createFreetFormHandler"/>
            <div :style="{visibility: formVis}">
                <CreateFreetForm
                    v-on:success="success"
                    v-on:close="createFreetFormHandler"
                />
            </div>
        </div>
    </span>
</template>

<script src="../../public/services.js"></script>
<script>
    import CreateFreetForm from './CreateFreetForm.vue';
    export default {
        name: 'FreetOptions',
        props: ['isLoggedIn', 'vis'],
        components: {CreateFreetForm},
        data() {
            return {
                searchText: 'Search Freets by Author',
                createFreetOpen: false,
            }
        },
        computed: {
            formVis: function() {
                return this.createFreetOpen ? 'visible' : 'hidden';
            }
        },
        methods: {
            searchHandler() {
                if (this.searchText = 'Search Freets by Author') {
                    this.searchText = '';
                }
            },
            createFreetFormHandler() {
                this.createFreetOpen = !this.createFreetOpen;
            },
            viewAllFreetsHandler() {
              const fields = {};
              viewAllFreets(fields, this.success, this.error);
              localStorage.lastCall = "all";
            },
            viewFreetsByAuthorHandler() {
              const fields = {author: this.searchText};
              viewFreetsByAuthor(fields, this.success, this.error);
              localStorage.lastCall = "author";
              localStorage.author = this.searchText;
            },
            success(obj) {
                this.$emit('success', obj);
            },
            error(obj) {
              localStorage.lastCall = 'home';
              this.$emit('error', obj);
            }
        }
    }
</script>

<style scoped>
    .freetOptions {
        display: inline-flex;
        width: 100%;
        height: 34px;
        background-color: var(--darkblue);
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .freetOptions input:first-of-type {
        margin-left: 10px !important;
    }

    .allButton {
        width: 140px !important;
    }

    input {
        margin-top: 0px !important;
        margin-bottom: 0px !important;
    }

    .searchbox {
        display: inline-flex;
        margin-right: auto;
        margin-left: auto;
    }

    .search {
        padding-top: 0px;
        padding-bottom: 0px;
        padding-left: 5px;
        margin-left: 10px;
        flex: 1;
        max-width: 400px;
        border-radius: 4px 0px 0px 4px;
        height: 34px !important;
    }

    .searchButton {
        border-radius: 0px 4px 4px 0px;
        margin-left: 0px;
    }

    .create {
        display: flex;
        flex-direction: column;
        width: 100px;
        margin-right: 10px;
    }

    .createbutton {
        width: 100px;
        position: relative;
        right: 10px !important;
    }
</style>
