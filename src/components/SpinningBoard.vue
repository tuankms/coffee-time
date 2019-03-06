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
import { uniqueArray } from '@/utils/collection';
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

      this.currentUser = this.users[currentUserId] || null;

      if (!this.currentUser) {
        return;
      }

      this.findPartner(this.currentUser);

      this.hasShowResult = true;
    },
    findPartner: function(currentUser) {
      if (!currentUser) {
        return null;
      }

      const { relationship: currentPartnerIds } = currentUser;
      const allUserIds = userService.getAllUserIds(this.users);

      // Find partners
      const suggestedPartnerIds = allUserIds.filter(curUserId => {
        const index = currentPartnerIds.findIndex(reUserId => {
          return reUserId === curUserId;
        });

        return index === -1 && curUserId !== this.currentUserId;
      });

      if (suggestedPartnerIds.length === 0) {
        this.suggestedPartner = null;
        return;
      }

      // Add new partner to current user
      const suggestedPartnerId = userService.randomUser(suggestedPartnerIds);
      currentPartnerIds.push(suggestedPartnerId);

      // Add current user as a partner of suggested user, too
      this.suggestedPartner = this.users[suggestedPartnerId];
      const suggestedPartners = this.suggestedPartner.relationship;
      suggestedPartners.push(this.currentUserId);
      this.suggestedPartner.relationship = uniqueArray(suggestedPartners);

      userService.update(this.currentUserId, {
        ...currentUser
      });

      userService.update(suggestedPartnerId, {
        ...this.suggestedPartner
      });
    },
    addNewUser: function(userId) {
      userService.create(userId, {
        fullName: userId // We assume userId and fullname is the same
      }).then(() => {
        this.hasShowSignup = false;
        this.newUserId = null;
        this.currentUserId = userId;

        this.spin(userId);
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
