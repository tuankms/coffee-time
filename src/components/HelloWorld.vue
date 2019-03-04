<template>
  <div class="hello">
    <ul class="userList">
      <li v-for="user in users" v-bind:key="user.fullName">
        {{ user.fullName }}
        <button @click="deleteUser(user)">
          Remove
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase';

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  },
  firestore () {
    return {
      users: db.collection('users')
    };
  },
  methods: {
    addUser: function () {
      // TODO implement it
    },
    deleteUser: function (user) {
      // TODO implement it
      console.log(user);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
