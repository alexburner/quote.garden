import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const fireapp = firebase.initializeApp({
  apiKey: "AIzaSyDR2zyCGLTU9cx6SZmsTvzUq31DLfoAd3U",
  authDomain: "quotes-92672.firebaseapp.com",
  databaseURL: "https://quotes-92672.firebaseio.com",
  storageBucket: "quotes-92672.appspot.com",
  messagingSenderId: "936175857202",
});

export default fireapp;
export {firebase, fireapp};