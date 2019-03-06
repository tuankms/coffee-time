import db from '@/firebase';
import { isEmpty, uniqueArray } from '@/utils/collection';

const COLLECTION_NAME = 'users';

class UserService {
  getCollection = () => {
    return db.collection(COLLECTION_NAME);
  };

  update = (userId, user) => {
    // TODO should validate user object before updating
    const { fullName, relationship } = user;

    return this.getCollection().doc(userId).update({
      fullName,
      relationship
    }).catch((error) => {
      console.error('Error when removing document: ', error);
    });
  };

  create = (userId, user) => {
    const { fullName, id } = user;

    return this.getCollection().doc(userId).set({
      id,
      fullName,
      relationship: []
    }).catch((error) => {
      console.error('Error when adding document: ', error);
    });
  };

  get = (userId) => {
    return this.getCollection().doc(userId).get().then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    }).catch((error) => {
      console.log('Error getting document:', error);
    });
  }

  randomUser = (users) => {
    if (!users || isEmpty(users)) {
      return null;
    }
    return users[Math.floor(Math.random() * users.length)];
  }

  getAllUserIds = (users) => {
    if (!users) return [];

    return Object.keys(users);
  }

  findPartner = (currentUser, allUsers) => {
    if (!currentUser || !allUsers) {
      return null;
    }

    const { id: curUserId, relationship: currentPartnerIds } = currentUser;
    const allUserIds = this.getAllUserIds(allUsers);

    // Find partners
    const suggestedPartnerIds = allUserIds.filter(userId => {
      const index = currentPartnerIds.findIndex(partnerUserId => {
        return partnerUserId === userId;
      });

      return index === -1 && userId !== curUserId;
    });

    if (suggestedPartnerIds.length === 0) {
      return null;
    }

    return this.randomUser(suggestedPartnerIds);
  };

  updateRelations = (currentUser, partner) => {
    if (!currentUser || !partner) {
      return;
    }

    const { id: curId, relationship: curRelationship } = currentUser;
    const { id: partnerId, relationship: partnerRelationship } = partner;
    // Add partner to relationship of current user
    curRelationship.push(partnerId);

    // Add current user to relationship of the partner, too
    partnerRelationship.push(currentUser.id);
    partner.relationship = uniqueArray(partnerRelationship);

    this.update(curId, {
      ...currentUser
    });

    this.update(partnerId, {
      ...partner
    });
  }
}

export default new UserService();
