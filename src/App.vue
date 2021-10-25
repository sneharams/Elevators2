<template>
    <main id="app">
      <header class="topbar">
        <h1>Fritter</h1>
        <UserOptions
            v-bind:isLoggedIn="isLoggedIn"
            v-bind:vis="vis"
            v-on:sessionHandler="sessionHandler" 
        />
      </header>
      <FreetOptions
        v-bind:isLoggedIn="isLoggedIn"
        v-bind:vis="vis"
        v-on:freetHandler="freetHandler"
        v-on:errorHandler="errorHandler"
      />
      <span class="main">
        <Following
          v-bind:key="follow"
          v-bind:isLoggedIn="isLoggedIn"
          v-bind:vis="vis"
          v-bind:user="user"
          v-on:freetHandler="freetHandler"
          v-on:errorHandler="errorHandler"
          v-on:followed="followedHandler"
        />
        <Response 
          v-bind:response="responseProps" 
          v-bind:followed="followed"
          v-bind:user="user"
          v-on:delete="deleteHandler"
          v-on:edit="editHandler"
          v-on:followedHandler="followedHandler"
        />
      </span>
    </main>
</template>
    
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
          if (localStorage.responseProps) {
            this.responseProps = localStorage.responseProps;
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
              console.log(message);
              console.log('hi');
              this.responseProps = {
                message: message,
                freets: freets
              };
            },
            errorHandler(message) {
              console.log('hi');
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
            followedUpdateHandler(authors) {
              this.followed = authors;
              this.follow = !this.follow;
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
  background-color: var(--darkblue);
  color: white;
  padding: 10px;
  margin: 4px;
  font-weight: bold;
}


input[type="button"]:hover {
    cursor: pointer;
    background-color: var(--blue);
}

input[type="button"]:focus {
  outline: none;
}

.topbar {
  display: inline-flex;
  width: calc(100% - 10px);
  justify-content: space-between;
  background-color: lightgray;
  padding: 5px;
  height: 42px;
}

h1 {
  margin-top: auto;
  margin-bottom: auto;
}

.main {
  display: inline-flex;
  width: 100%;
  height: calc(100vh - 106px);
}

html, body, #app {
  height: 100vh;
  margin: 0px;
}

/* #nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
