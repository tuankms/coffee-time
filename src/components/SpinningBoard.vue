<template>
  <div class="spinningBoard">
    <div class="title">
      <h2>Please input your name ^ ^</h2>
    </div>

    <div class="body">
      <div v-if="!hasShowSignup" class="spinningForm">
        <form @submit.prevent="spin(currentUserId)">
          <input v-model="currentUserId" placeholder="Your name" class="input">
          <button type="submit">Spin Spin...</button>
        </form>

        <div class="signupMsg">
          or
          <a href="#" @click.prevent="openSignup()">Sign up</a> if you are a newcomer
        </div>
      </div>

      <div v-if="hasShowSignup" class="newUserForm">
        <div class="signupForm">
          <form @submit.prevent="addNewUser(newUserId)">
            <input v-model="newUserId" placeholder="Your name" class="input">
            <button type="submit">Signup and Spin now</button>
          </form>
        </div>
      </div>

      <div v-if="hasShowResult" class="result">
        <CoffeeTimePanel :message="viewResultMessage()"></CoffeeTimePanel>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '@/services/UserService';
import CoffeeTimePanel from './CoffeeTimePanel';

export default {
  name: 'SpinningBoard',
  components: {
    CoffeeTimePanel: CoffeeTimePanel
  },
  data() {
    return {
      users: [],
      currentUserId: null,
      currentUser: null,
      suggestedPartner: null,
      newUserId: null,
      hasShowSignup: false,
      hasShowResult: false
    };
  },
  firestore() {
    return {
      users: {
        ref: userService.getCollection(),
        objects: true
      }
    };
  },
  methods: {
    openSignup: function() {
      this.hasShowSignup = true;

      // Clean previous state before signup
      this.hasShowResult = false;
      this.currentUserId = null;
      this.currentUser = null;
    },
    viewResultMessage: function() {
      if (!this.currentUser) {
        return "Your name doesn't exist";
      }
      if (!this.suggestedPartner) {
        return "You've already caffeinated with everyone!";
      }

      const numberOfRelationship = this.currentUser.relationship.length;
      return `Get coffee with: ${
        this.suggestedPartner.fullName
      }, here’s how many times you’ve had coffee with them: ${numberOfRelationship}`;
    },
    spin: function(currentUserId) {
      this.suggestedPartner = null;
      this.hasShowResult = false;

      if (!currentUserId) {
        return null;
      }

      this.currentUserId = currentUserId.toLowerCase();

      this.currentUser = this.users[this.currentUserId] || null;
      this.hasShowResult = true;

      if (!this.currentUser) {
        return;
      }

      this.findPartner(this.currentUser, this.users);
    },
    findPartner: function(currentUser, users) {
      if (!currentUser) {
        this.suggestedPartner = null;
        return null;
      }

      const suggestedPartnerId = userService.findPartner(currentUser, users);

      if (!suggestedPartnerId) {
        this.suggestedPartner = null;
        return;
      }

      this.suggestedPartner = users[suggestedPartnerId];
      userService.updateRelations(currentUser, this.suggestedPartner);
    },
    addNewUser: function(userId) {
      if (!userId) {
        return;
      }

      const uid = userId.toLowerCase();

      userService.create(uid, {
        id: uid,
        fullName: uid // We assume userId and fullname is the same
      }).then(() => {
        this.hasShowSignup = false;
        this.newUserId = null;
        this.currentUserId = uid;

        this.spin(uid);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.spinningBoard {
  .body {
    .spinningForm {
      padding: 5px;
    }

    .signupMsg {
      padding: 10px;
    }

    .result {
      padding: 5px;
    }
  }
}
</style>
