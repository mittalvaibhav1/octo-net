import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDelYlXtAnaMgsuMi4yWTliFzzfIBOug0A",
    authDomain: "discord-clone-18569.firebaseapp.com",
    projectId: "discord-clone-18569",
    storageBucket: "discord-clone-18569.appspot.com",
    messagingSenderId: "818123000289",
    appId: "1:818123000289:web:a80946239771143152eaa0",
    measurementId: "G-7P1KKZS422"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();

export { auth, googleAuthProvider, twitterAuthProvider, githubAuthProvider };
export default db;
