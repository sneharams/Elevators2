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
          v-bind:user="user"
          v-bind:followed="followed"
          v-on:freetHandler="success"
          v-on:errorHandler="error"
        />
        <Response 
          v-bind:key="refresh"
          v-bind:response="responseProps" 
          v-bind:followed="followed"
          v-bind:upvotes="upvotes"
          v-bind:user="user"
          v-on:delete="deleteHandler"
          v-on:edit="editHandler"
          v-on:followedHandler="followedHandler"
          v-on:freetHandler="freetHandler"
          v-on:vote="voteHandler"
          v-on:sort="sortHandler"
        />
      </span>
      <div id="delete modal" :style="{display: modalDisplay}" class="modal">
        <div class="modal-content">
          <input type="button" v-on:click="modalHandler" class="close" value="Close"/>
          <p>Freet with ID: {{ deleteID }} deleted</p>
        </div>
      </div>
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
                upvotes: [],
                refresh: 0,
                sortType: 1,
                deleteID: '',
                modalDisplay: 'none'
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
              this.refresh += 1; // reset sort
            },
            freetHandler(message, freets) {
              this.responseProps = {
                message: message,
                freets: freets
              };
              this.sortHandler(this.sortType);
            },
            errorHandler(message) {
              this.responseProps = {
                message: message,
                freets: []
              };
            },
            editHandler(obj) {
              const freets = this.responseProps.freets;
              for (let i = 0; i < freets.length; i++) {
                if (freets[i].id == obj.data.freets[0].id) {
                  freets[i] = obj.data.freets[0];
                  break;
                }
              }
              this.responseProps = {
                message: this.responseProps.message,
                freets: freets
              };
            },
            deleteHandler(obj) {
              let freets = this.responseProps.freets;
              const id = obj.data.freets[0].id;
              freets = freets.filter(freet => freet.id != id);
              this.deleteID = id;
              this.responseProps.freets = freets;
              this.modalDisplay = 'block';
            },
            modalHandler() {
              this.modalDisplay = 'none';
            },
            voteHandler(obj){
              const freets = this.responseProps.freets;
              const id = obj.data.freets[0].id;
              for (let i = 0; i < freets.length; i++) {
                if (freets[i].id == id) {
                  this.responseProps.freets[i] = obj.data.freets[0];
                  break;
                }
              }
              const fields = {};
              getUpvotes(fields, this.upvotesSuccess, this.error);
            },
            followedHandler(authors) {
              this.followed = authors;
            },
            sortHandler(type) {
              let freets = this.responseProps.freets;
              this.sortType = type;
              switch (type) {
                case 1:
                  freets.sort((a, b) => (parseInt(a.id) < parseInt(b.id)) ? 1 : -1);
                  break;
                case 2:
                  freets.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1);
                  break;
                case 3:
                  freets.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1);
                  freets.sort((a, b) => (parseInt(a.upvotes) < parseInt(b.upvotes)) ? 1 : -1);
                  break;
                case 4:
                  freets.sort((a, b) => (parseInt(a.id) > parseInt(b.id)) ? 1 : -1);
                  freets.sort((a, b) => (parseInt(a.upvotes) > parseInt(b.upvotes)) ? 1 : -1);
                  break;
              }
              this.responseProps = {
                message: this.responseProps.message,
                freets: freets
              }
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
              this.sortHandler(this.sortType);
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
  --offlightblue: #E5ECF5;
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
  text-align: center;
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
  overflow: hidden;
}

.logo {
  width: 40px;
  height: 40px;
  margin-left: 5px;
}

.modal {
  position: fixed; 
  z-index: 1; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto; 
  background-color: rgba(255,255,255, 0.4);
}

.modal-content {
  color: white;
  background-color: var(--blue);
  margin: 15% auto; 
  padding: 20px;
  width: 80%; 
  border-radius: 8px 8px 8px 8px;
  box-shadow: 0px 2px 4px var(--darkblue);
}

.close {
  float: right;
  font-weight: bold;
}
</style>
