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
import db from '@/firebase';
import { getKeyValue } from '@/utils/firestore';
import userService from '@/services/UsersService';

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
      users: userService.getCollection(),
    };
  },
  methods: {
    spinHandler: function(currentUserId) {
      this.suggestedUser = null;

      const currentUser = this.users.find((u) => {
        return getKeyValue(u) === currentUserId;
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
        return getKeyValue(u);
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

      const suggestedUserId = userService.randomUser(listUserSatify);
      const suggestedUser = this.users.find(function(u) {
        return getKeyValue(u) === suggestedUserId;
      });

      this.suggestedUser = suggestedUser;

      currentUser.relationship.push(getKeyValue(suggestedUser));

      this.updateUser(getKeyValue(currentUser), {
        fullName: currentUser.fullName,
        relationship: currentUser.relationship
      });
    },
    addNewUser: function(key, userFullName) {
      userService.create(key, userFullName);
    },
    updateUser: function(key, user) {
      userService.update(key, user);
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
