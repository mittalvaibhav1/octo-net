import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCKaW4Bigj48hmNLqOHUEYtNp7Ys1I5Eh8",
    authDomain: "octo-net.firebaseapp.com",
    projectId: "octo-net",
    storageBucket: "octo-net.appspot.com",
    messagingSenderId: "87652945238",
    appId: "1:87652945238:web:cd9118ff7ed954501b1af7",
    measurementId: "G-4SDRW6JPW2"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();

export { auth, googleAuthProvider, twitterAuthProvider, githubAuthProvider };
export default db;
