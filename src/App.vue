<template>
    <main id="app">
      <header class="topbar">
        <h1 v-on:click="homeHandler">Fritter</h1>
        <UserOptions
            v-bind:isLoggedIn="isLoggedIn"
            v-bind:vis="vis"
            v-on:sessionHandler="sessionHandler" 
            v-on:error="error"
        />
      </header>
      <FreetOptions
        v-bind:isLoggedIn="isLoggedIn"
        v-bind:vis="vis"
        v-on:success="success"
        v-on:error="error"
      />
      <span class="main">
        <Following
          v-bind:key="follow"
          v-bind:isLoggedIn="isLoggedIn"
          v-bind:vis="vis"
          v-bind:user="user"
          v-bind:authors="followed"
          v-on:freetHandler="freetHandler"
          v-on:errorHandler="errorHandler"
        />
        <Response 
          v-bind:response="responseProps" 
          v-bind:followed="followed"
          v-bind:user="user"
          v-on:delete="deleteHandler"
          v-on:edit="editHandler"
          v-on:followedHandler="followedHandler"
          v-on:freetHandler="freetHandler"
        />
      </span>
    </main>
</template>
    
<script src="../public/services.js"></script>
<script>
     import Response from './components/Response.vue';
     import UserOptions from './components/UserOptions.vue';
     import FreetOptions from './components/FreetOptions.vue';
     import Following from './components/Following.vue';
     export default {
        name: 'app',
        components: {Response, UserOptions, FreetOptions, Following},
        data() {
            return {
                responseProps: {
                    message: 'Welcome!',
                    freets: [],
                },
                isLoggedIn: false,
                user: '',
                follow: true,
                followed: []
            }
        },
        computed: {
          vis: function() {
            if (this.isLoggedIn) {
              return 'visible';
            } 
            return 'hidden';
          }
        },
        mounted() {
          if (localStorage.user) {
            this.isLoggedIn = true;
            this.user = localStorage.user;
          }
          if (localStorage.lastCall) {
            if (this.user != '') {
              switch (localStorage.lastCall) {
                case 'all':
                  const fields = {}
                  viewAllFreets(fields, this.success, this.error);
                  break;
                case 'author':
                  if (localStorage.author) {
                    const fields = {
                      author: localStorage.author
                    }
                    viewFreetsByAuthor(fields, this.success, this.error);
                  } else {
                    localStorage.lastCall = 'home';
                    this.homeHandler();
                  }
                  break;
                default:
                  localStorage.lastCall = 'home';
                  this.homeHandler();
              }
            } else {
              localStorage.lastCall = 'home';
              this.homeHandler();
            }
          }
        },
        watch: {
            isLoggedIn: function() {
                if (this.isLoggedIn) {
                    // get followed authors
                    const fields = {};
                    getFollowedAuthors(fields, this.followingSuccess, this.error);
                } else {
                    this.authors = [];
                    this.$emit('followed', this.authors);
                }
            }
        },
        methods: {
            sessionHandler(status, message, user) {
              if (message == null) {
                message = this.message;
              }
              this.isLoggedIn = status;
              this.user = user;
              this.responseProps = {
                message: message,
                freets: [],
              };
              localStorage.responseProps = this.responseProps;
              localStorage.user = this.user;
            },
            freetHandler(message, freets) {
              this.responseProps = {
                message: message,
                freets: freets
              };
            },
            errorHandler(message) {
              this.responseProps = {
                message: message,
                freets: []
              };
            },
            editHandler(obj) {
              const freets = this.responseProps.freets;
              const id = obj.data.freets[0].id;
              const content = obj.data.freets[0].content;
              for (let i = 0; i < freets.length; i++) {
                if (freets[i].id == id) {
                  freets[i].content = content;
                  break;
                }
              }
              this.responseProps.freets = freets;
            },
            deleteHandler(obj) {
              const freets = this.responseProps.freets;
              const id = obj.data.freets[0].id;
              for (let i = 0; i < freets.length; i++) {
                if (freets[i].id == id) {
                  freets[i].content = "deleted";
                  break;
                }
              }
              this.responseProps.freets = freets;
            },
            followedHandler(authors) {
              this.followed = authors;
            },
            followingSuccess(obj) {
                this.followed = obj.data.followed;
            },
            error(obj) {
              if (obj.status==403) {
                localStorage.lastCall = 'home';
                if (this.isLoggedIn) {
                  // logged out on server, but logged in on client-side
                  // update client-side to logged in
                  this.user = '';
                  this.sessionHandler(false, obj.data.error, this.user);
                } else {
                  // logged out on client-side, but logged in on server
                  // update client-side to logged out
                  this.user = obj.data.user;
                  this.sessionHandler(true, obj.data.error, this.user);
                }
                this.homeHandler();
              } else {
                const message = ["Error",obj.status,obj.statusText,"-",obj.data.error].join(' ');
                this.errorHandler(message);
              }
            },
            success(obj) {
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
              this.responseProps = {
                freets: freets,
                message: obj.data.msg
              };
            },
            homeHandler() {
              localStorage.lastCall = 'home';
              this.responseProps = {
                freets: [],
                message: 'Welcome!'
              }
            }
        }
    } 
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  --std-color: #2c3e50;
  --darkblue:  #3973ac;
  --blue:      #6699cc;
  --lightblue: #9fbfdf;
  --stdheight: 34px;
  display: flex;
  flex-direction: column;
}

input {
  border: none;
  border-radius: 4px;
  height: var(--stdheight);
}

input[type="button"] {
  background-color: var(--blue);
  color: white;
  padding: 10px;
  margin: 6px;
  font-weight: bold;
}


input[type="button"]:hover {
    cursor: pointer;
    background-color: var(--lightblue);
}

input[type="button"]:focus {
  outline: none;
}

.topbar {
  display: inline-flex;
  width: calc(100% - 10px);
  justify-content: space-between;
  background-color: var(--darkblue);
  border-bottom: solid;
  border-color: var(--blue);
  padding: 7px;
  padding-left: 5px;
  padding-right: 5px;
  height: 42px;
}

h1 {
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 5px;
  color: white;
  font-weight: normal;
}

h1:hover {
  color: var(--lightblue);
}

.main {
  display: inline-flex;
  width: 100%;
  height: calc(100vh - 112px);
  overflow: hidden;
}

html, body, #app {
  height: 100vh;
  margin: 0px;
}
</style>
