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

function createNewBet(obj) {
    return firestore.collection('bets').add({ obj })
}

function getBet(id) {
    return firestore.collection('bets').doc(`${id}`).get().then(bet => bet.data()).catch(err => console.log(err, 'err getting the data'))
}

async function getAllBets(id) {
    const arr = []
    const bets = await firestore.collection('bets').get()
    .then(allBets => 
        allBets.forEach(bet => 
            arr.push(bet.data())
        )
    ).catch(err => console.log(err, 'err getting the data'))
    const filtered = arr.filter(element => element.obj.takerId === "" && element.obj.userId !== id)

    return filtered
}

export { createNewUser, getUser, updateUser, createNewBet, getBet, getAllBets }

//Create User
//Name, Username, Email, Venmo, authToken
//Fetch User
//by: authToken
//Update User
//by: authToken
