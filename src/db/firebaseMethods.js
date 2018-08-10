import firestore from "./firebase"

function getUser(id) {
    return firestore.collection("users").doc(id).get().then(user => user.data())
}

function updateUser(id, obj) {
    return firestore.collection("users").doc(`${id}`).set({ obj })
} 

function createNewUser(id, obj) {
    return firestore.collection("users").doc(`${id}`).set({ obj })
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
