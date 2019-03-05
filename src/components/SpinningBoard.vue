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
          <a href="#" @click.prevent="openSignup()">Sign up</a> if you are a new commer
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
import { getKeyValue } from "@/utils/firestore";
import { uniqueArray } from "@/utils/collection";
import userService from "@/services/UsersService";

import CoffeeTimePanel from "./CoffeeTimePanel";

export default {
  name: "SpinningBoard",
  components: {
    CoffeeTimePanel: CoffeeTimePanel
  },
  data() {
    return {
      users: [],
      currentUserId: null,
      currentUser: null,
      suggestedUser: null,
      newUserId: null,
      hasShowSignup: false,
      hasShowResult: false
    };
  },
  firestore() {
    return {
      users: userService.getCollection()
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
    spin: function(currentUserId) {
      this.suggestedUser = null;

      const currentUser = this.users.find(u => {
        return getKeyValue(u) === currentUserId;
      });

      if (!currentUser) {
        this.currentUser = null;
        return;
      }

      this.currentUser = currentUser;
      this.getSuggestedUser(this.currentUser);

      this.hasShowResult = true;
    },
    viewResultMessage: function() {
      if (!this.suggestedUser) {
        return "You've already caffeinated with everyone!";
      }

      const numberOfRelationship = this.currentUser.relationship.length;
      return `Get coffee with: ${
        this.suggestedUser.fullName
      }, here’s how many times you’ve had coffee with them: ${numberOfRelationship}`;
    },
    getSuggestedUser: function(currentUser) {
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
        this.suggestedUser = null;
        return;
      }

      // Add new partner to current user
      const suggestedUserId = userService.randomUser(suggestedPartnerIds);
      currentPartnerIds.push(suggestedUserId);

      // FIXME Need to improve performance of finding suggested user
      this.suggestedUser = this.users.find(function(u) {
        return getKeyValue(u) === suggestedUserId;
      });

      // Add current user as a partner of suggested user, too
      const suggestedUserPartners = this.suggestedUser.relationship;
      suggestedUserPartners.push(this.currentUserId);
      this.suggestedUser.relationship = uniqueArray(suggestedUserPartners);

      userService.update(getKeyValue(currentUser), {
        ...currentUser
      });

      userService.update(suggestedUserId, {
        ...this.suggestedUser
      });
    },
    addNewUser: function(userId) {
      // We assume userId and fullname is the same
      const fullName = userId;
      userService.create(userId, fullName).then(() => {
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
