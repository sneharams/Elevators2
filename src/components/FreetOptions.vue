<template>
    <span class=".freetOptions">
        <label>Search Freets by Author</label>
        <input class="search" type="text" v-model="searchText" />
        <input type="button" value="Search" v-on:click="viewFreetsByAuthorHandler"/>
        <input type="button" value="View All Freets" v-on:click="viewAllFreetsHandler"/>
        <div class="create" :style="{visibility: isLoggedIn ? 'visible' : 'hidden'}">
            <input type="button" value="Create Freet" v-on:click="createFreetFormHandler"/>
            <div :style="{visibility: createFreetOpen ? 'visible' : 'hidden'}">
                <CreateFreetForm
                    v-on:succes="success"
                    v-on:close="createFreetFormHandler"
                />
            </div>
        </div>
    </span>
</template>

<script src="../javascripts/services.js"></script>
<script>
    import CreateFreetForm from './CreateFreetForm.vue';
    export default {
        props: ['isLoggedIn'],
        components: {CreateFreetForm},
        data() {
            return {
                searchText: '',
                createFreetOpen: false,
            }
        },
        methods: {
            createFreetFormHandler() {
                this.createFreetOpen = !this.createFreetOpen;
            },
            viewAllFreetsHandler() {
              const fields = {};
              viewAllFreets(fields, this.success, this.error);
            },
            viewFreetsByAuthorHandler() {
              const fields = {author: '_'+this.searchText};
              viewFreetsByAuthor(fields, this.success, this.error);
            },
            success(obj) {
              console.log('freet options hi');
              let freets = [];
              // create properties for each freet
              for (let [key, value] of Object.entries(obj.data.freets)) {
                  freets.push({
                      id: value.id,
                      content: value.content,
                      author: value.author
                  });
              };
              // sort freets by id (greatest -> smallest), so most recent freets displayed first
              freets.sort((a, b) => (parseInt(a.id) < parseInt(b.id)) ? 1 : -1);
              this.$emit('freetHandler', obj.data.msg, freets);
            },
            error(obj) {
              const message = ["Error",obj.status,obj.statusText,"-",obj.data.error].join(' ');
              this.$emit('errorHandler', message);
            }
        }
    }
</script>

<style scoped>
    label {
        margin-top: auto;
        margin-bottom: auto;
    }
    span {
        display: inline-flex;
        width: 100%;
        height: 42px;
        background-color: var(--lightblue) !important;
    }

    input[type="text"] {
        margin-top: 4px;
        margin-bottom: 4px;
        padding-top: 0px;
        padding-bottom: 0px;
        height: 34px !important;
    }

    .create {
        width: 190px;
    }
</style>
