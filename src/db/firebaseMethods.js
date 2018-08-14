import firestore from "./firebase"
import * as firebase from 'firebase';

function getUser(id) {
    return firestore.collection("users").doc(id).get().then(user => user.data())
}

function updateUser(obj) {
    return firestore.collection("users").doc(`${obj.id}`).set({ obj })
}

function createNewUser(obj) {
    return firestore.collection("users").doc(`${obj.id}`).set({ obj })
}

function createNewBet(id, obj) {
    return firestore.collection('bets').add({ obj })
}


export { createNewUser, getUser, updateUser, createNewBet }

//Create User
//Name, Username, Email, Venmo, authToken
//Fetch User
//by: authToken
//Update User
//by: authToken
