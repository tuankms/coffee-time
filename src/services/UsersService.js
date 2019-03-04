import db from '@/firebase';

const COLLECTION_NAME = 'users';

class UserService {
    getCollection = () => {
      return db.collection(COLLECTION_NAME);
    };

    update = (key, user) => {
      return this.getCollection().doc(key).update({
        fullName: user.fullName,
        relationship: user.relationship
      }).catch((error) => {
        console.error('Error when removing document: ', error);
      });
    };

    create = (key, userFullName) => {
      this.getCollection().doc(key).set({
        fullName: userFullName,
        relationship: []
      }).catch((error) => {
        console.error('Error when adding document: ', error);
      });
    };

    get = (userId) => {
      this.getCollection().doc(userId).get().then((doc) => {
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
      if (!users) {
        return null;
      }
      return users[Math.floor(Math.random() * users.length)];
    }
}

export default new UserService();
