<template>
    <main id="app">
      <header class="topbar">
        <h1>Fritter</h1>
        <UserOptions
            v-bind:isLoggedIn="isLoggedIn"
            v-on:sessionHandler="sessionHandler" 
        />
      </header>
      <FreetOptions
        v-bind:isLoggedIn="isLoggedIn"
        v-on:freetHandler="freetHandler"
        v-on:errorHandler="errorHandler"
      />
      <Response 
        v-bind:response="responseProps" 
        v-bind:user="user"
        v-on:delete="deleteHandler"
        v-on:edit="editHandler"
      />
    </main>
</template>
    
<script>
     import Response from './components/Response.vue';
     import UserOptions from './components/UserOptions.vue';
     import FreetOptions from './components/FreetOptions.vue';
     export default {
        name: 'app',
        components: {Response, UserOptions, FreetOptions},
        data() {
            return {
                responseProps: {
                    message: 'Welcome!',
                    freets: [],
                },
                isLoggedIn: false,
                user: '',
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
  --darkblue:  #3973ac;
  --blue:      #6699cc;
  --lightblue: #9fbfdf;
  --stdheight: 34px;
}

input {
  border: none;
  height: var(--stdheight);
}

input[type="button"] {
  background-color: var(--darkblue);
  color: white;
  padding: 10px;
  margin: 4px;
  font-weight: bold;
}

input[type="button"]:focus {
  outline: none;
}

.topbar {
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  background-color: lightgray;
  padding: 5px;
  height: 42px;
}

h1 {
  margin-top: auto;
  margin-bottom: auto;
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
