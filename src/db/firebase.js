import * as firebase from 'firebase';
import 'firebase/firestore';

const settings = { timestampsInSnapshots: true };

var config = {
    apiKey: "AIzaSyBnI1899HIk6EZzGbgQRd48jU26fPNqVDk",
    authDomain: "molli-e1c3f.firebaseapp.com",
    databaseURL: "https://molli-e1c3f.firebaseio.com",
    projectId: "molli-e1c3f",
    storageBucket: "",
    messagingSenderId: "332857176669"
};

const firestore = firebase.initializeApp(config).firestore()
firestore.settings(settings)

// firestore.enablePersistence()
export default firestore

