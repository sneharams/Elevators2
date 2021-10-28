<template>
    <main id="app" v-cloak>
      <header class="topbar">
        <img class="logo" src="./assets/fritter.png"/>
        <h1 v-on:click="homeHandler">
          Fritter
        </h1>
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
          v-bind:followed="followed"
          v-on:freetHandler="success"
          v-on:errorHandler="error"
        />
        <Response 
          v-bind:response="responseProps" 
          v-bind:followed="followed"
          v-bind:upvotes="upvotes"
          v-bind:user="user"
          v-on:delete="deleteHandler"
          v-on:edit="editHandler"
          v-on:followedHandler="followedHandler"
          v-on:freetHandler="freetHandler"
          v-on:vote="voteHandler"
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
                followed: [],
                upvotes: []
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
            const fields = {};
            getFollowedAuthors(fields, this.loginSuccess, this.error);
          }
          if (localStorage.lastCall) {
            if (this.user != '') {
              switch (localStorage.lastCall) {
                case 'all':
                  let fields = {}
                  viewAllFreets(fields, this.success, this.error);
                  break;
                case 'author':
                  if (localStorage.author) {
                    let fields = {
                      author: localStorage.author
                    }
                    viewFreetsByAuthor(fields, this.success, this.error);
                  } else {
                    localStorage.lastCall = 'home';
                    this.homeHandler();
                  }
                  break;
                case 'all followed':
                  fields = {};
                  viewFreetsByFollowedAuthors(fields, this.success, this.error);
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
                    this.followed = [];
                    this.upvotes = [];
                    const fields = {};
                    getFollowedAuthors(fields, this.loginSuccess, this.error);
                } else {
                    this.followed = [];
                    this.upvotes - [];
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
            voteHandler(obj){
              const freets = this.responseProps.freets;
              const id = obj.data.freets[0].id;
              for (let i = 0; i < freets.length; i++) {
                if (freets[i].id == id) {
                  freets[i] = obj.data.freets[0];
                  break;
                }
              }
              this.responseProps.freets = freets;
              const fields = {};
              getUpvotes(fields, this.upvotesSuccess, this.error);
            },
            followedHandler(authors) {
              this.followed = authors;
            },
            followingSuccess(obj) {
              this.followed = obj.data.followed;
            },
            upvotesSuccess(obj) {
              this.upvotes = obj.data.upvotes;
            },
            loginSuccess(obj) {
              this.followed = obj.data.followed;
              const fields = {};
              getUpvotes(fields, this.upvotesSuccess, this.error);
            },
            error(obj) {
              if (obj.status==403) {
                localStorage.lastCall = 'home';
                if (this.isLoggedIn) {
                  // logged out on server, but logged in on client-side
                  // update client-side to logged in
                  const user = '';
                  this.sessionHandler(false, obj.data.error, user);
                } else {
                  // logged out on client-side, but logged in on server
                  // update client-side to logged out
                  const user = obj.data.user;
                  this.sessionHandler(true, obj.data.error, user);
                }
                this.homeHandler();
              } else {
                const message = ["Error",obj.status,obj.statusText,"-",obj.data.error].join(' ');
                this.errorHandler(message);
              }
            },
            success(obj) {
              let freets = obj.data.freets;
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
  --darkblue:  #6F8FBA;
  --blue:      #8EB1D9;
  --offblue:   #ADC4DD;
  --lightblue: #CAD5E3;
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
  background-color: var(--darkblue);
  color: white;
  padding: 10px;
  margin: 6px;
  font-weight: bold;
}


input[type="button"]:hover {
    cursor: pointer;
    background-color: var(--offblue);
}

input[type="button"]:focus {
  outline: none;
}

.topbar {
  display: inline-flex;
  width: calc(100% - 10px);
  justify-content: space-between;
  background-color: var(--blue);
  border-bottom: solid;
  border-color: var(--darkblue);
  padding: 7px;
  padding-left: 5px;
  padding-right: 5px;
  height: 42px;
}

h1 {
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 5px;
  color: white;
  font-weight: normal;
  margin-right: auto;
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

.logo {
  width: 40px;
  height: 40px;
  margin-left: 5px;
}
</style>
