import { firebase } from '@firebase/app';
import '@firebase/firestore';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyCCdgMEMpU6md3IjSMEnuQdg6C3a52sQrs',
  authDomain: 'coffee-time-9ee6c.firebaseapp.com',
  databaseURL: 'https://coffee-time-9ee6c.firebaseio.com',
  projectId: 'coffee-time-9ee6c',
  storageBucket: 'coffee-time-9ee6c.appspot.com',
  messagingSenderId: '342613477686'
});

export const db = firebaseApp.firestore();
