<template>
  <div class="spinningBoard">
    <div class="inputForm">
      <form @submit.prevent="spinHandler(currentUserId)">
        <h2>Please input your name ^ ^</h2>
        <input v-model="currentUserId" placeholder="Your name" class="input">
        <button type="submit">Spin Spin...</button>
      </form>
    </div>    

    <div class="result" v-if="currentUser">
      <CoffeeTimePanel :message="viewResultMessage()"></CoffeeTimePanel>
    </div>
  </div>
</template>

<script>
import db from '../firebase';

import CoffeeTimePanel from './CoffeeTimePanel';

export default {
  name: 'SpinningBoard',
  components: {
    'CoffeeTimePanel': CoffeeTimePanel
  },
  data () {
    return {
      users: [],
      currentUserId: null,
      currentUser: null,
      suggestedUser: null,
    };
  },
  firestore() {
    return {
      users: this.getAllUsers(),
    };
  },
  methods: {
    spinHandler: function(currentUserId) {
      this.suggestedUser = null;

      const currentUser = this.users.find(function(u) {
        return u['.key'] === currentUserId;
      });

      if (!currentUser) {
        this.currentUser = null;
        return;
      }

      this.currentUser = currentUser;
      this.getSuggestedUser(this.currentUser);
    },
    viewResultMessage: function() {
      if (!this.suggestedUser) {
        return "You've already caffeinated with everyone!";
      }

      const numberOfRelationship = this.currentUser.relationship.length;
      return `Get coffee with: ${this.suggestedUser.fullName}, here’s how many times you’ve had coffee with them: ${numberOfRelationship}`;
    },
    getSuggestedUser: function (currentUser) {
      if (!currentUser) {
        return null;
      }

      const currentRelationShip = currentUser.relationship;
      const allUsers = this.users.map(function(u) {
        return u['.key']
      });

      const listUserSatify = allUsers.filter((curUserId) => {
        const index = currentRelationShip.findIndex((reUserId) => {
          return reUserId === curUserId;
        });

        return index === -1 && curUserId !== this.currentUserId;
      });

      if (listUserSatify.length === 0) {
        this.suggestedUser = null;
        return;
      }

      const suggestedUserId = this.randomUser(listUserSatify);
      const suggestedUser = this.users.find(function(u) {
        return u['.key'] === suggestedUserId;
      });

      this.suggestedUser = suggestedUser;

      currentUser.relationship.push(suggestedUser['.key']);

      this.updateUser(currentUser['.key'], {
        fullName: currentUser.fullName,
        relationship: currentUser.relationship
      });
    },
    randomUser: function(users) {
      if (!users) {
        return null;
      }

      return users[Math.floor(Math.random() * users.length)];
    },
    getAllUsers: function() {
      return db.collection('users');
    },
    getUserById: function(docId) {
      var docRef = db.collection('users').doc(docId);

      docRef.get().then((doc) => {
        if (doc.exists) {
            console.log('Document data:', doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
        }
      }).catch((error) => {
        console.log('Error getting document:', error);
      });
    },
    addNewUser: function(key, userFullName) {
      db.collection("users").doc(key).set({
          fullName: userFullName,
          relationship: []
      }).then(() => {
          this.users = this.getAllUsers('users');
      });
    },
    updateUser: function(key, user) {
      db.collection("users").doc(key).update({
        fullName: user.fullName,
        relationship: user.relationship
      }).then(() => {
          this.users = this.getAllUsers('users');
      }).catch((error) => {
          console.error('Error removing document: ', error);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .spinningBoard {

    .inputForm {
      padding: 5px;
    }

    .result {
      padding: 5px;
    }

  }
</style>
