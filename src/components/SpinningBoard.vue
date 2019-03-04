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
      console.log(currentUserId);

      const currentUser = this.users.find(function(u) {
        return u['.key'] === currentUserId;
      });

      if (!currentUser) {
        alert('Cant find this user !');
        this.currentUser = null;
        return;
      }

      console.log('currentUser', currentUser);
      console.log('currentUser.relationship', currentUser.relationship);

      this.currentUser = currentUser;
      this.getSuggestedUser();
    },
    viewResultMessage: function() {
      if (!this.suggestedUser) {
        return "You've already caffeinated with everyone!";
      }

      const numberOfRelationship = this.currentUser.relationship.length;
      return `Get coffee with: ${this.suggestedUser.fullName}, here’s how many times you’ve had coffee with them: ${numberOfRelationship}`;
    },
    getSuggestedUser: function () {
      if (!this.currentUser) {
        return null;
      }

      const currentRelationShip = this.currentUser.relationship;
      const allUsers = this.users.map(function(u) {
        return u['.key']
      });

      console.log('currentRelationShip', currentRelationShip);
      console.log('allUsers', allUsers);

      let that = this;
      const listUserSatify = allUsers.filter(function(curUserId) {
        const index = currentRelationShip.findIndex(function(reUserId) {
          return reUserId === curUserId;
        });

        console.log(index);
        return index === -1 && curUserId !== that.currentUserId;
      });

      if (listUserSatify.length === 0) {
        this.suggestedUser = null;
        return;
      }

      console.log('listUserSatify', listUserSatify);

      const suggestedUserId = this.randomUser(listUserSatify);
      const suggestedUser = this.users.find(function(u) {
        return u['.key'] === suggestedUserId;
      });

      console.log('suggestedUser', suggestedUser);
      this.suggestedUser = suggestedUser;

      this.currentUser.relationship.push(suggestedUser['.key']);

      this.updateUser(this.currentUser['.key'], {
        fullName: this.currentUser.fullName,
        relationship: this.currentUser.relationship
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

      docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log('Document data:', doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
        }
      }).catch(function(error) {
        console.log('Error getting document:', error);
      });
    },
    addNewUser: function(key, userFullName) {
      db.collection("users").doc(key).set({
          fullName: userFullName,
          relationship: []
      }).then(function() {
          this.users = this.getAllUsers('users');
      }).bind(this);
    },
    updateUser: function(key, user) {
      db.collection("users").doc(key).update({
        fullName: user.fullName,
        relationship: user.relationship
      }).then(function() {
          alert('Document successfully updated!');
          this.users = this.getAllUsers('users');
      }).catch(function(error) {
          console.error('Error removing document: ', error);
      }).bind(this);
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
