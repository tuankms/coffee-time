import db from '@/firebase';
import { isEmpty } from '@/utils/collection';

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
    const { fullName } = user;

    return this.getCollection().doc(userId).set({
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
}

export default new UserService();
