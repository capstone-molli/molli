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

async function getAllBets() {
    const arr = []
    const bets = await firestore.collection('bets').get()
    .then(allBets => 
        allBets.forEach(bet => 
            arr.push(bet.data())
        )
    ).catch(err => console.log(err, 'err getting the data'))
    const filtered = arr.filter(element => element.obj.takerId === "")

    return filtered
}

async function getAllBets() {
    const arr = []
    const bets = await firestore.collection('bets').get()
    .then(allBets => 
        allBets.forEach(bet => 
            arr.push(bet.data())
        )
    ).catch(err => console.log(err, 'err getting the data'))
    const filtered = arr.filter(element => element.obj.takerId === "")

    return filtered
}

async function getAllBetsbyUser(id) {
    const arr = []
    const bets = await firestore.collection('bets').get()
    .then(allBets => 
        allBets.forEach(bet => 
            arr.push(bet.data())
        )
    ).catch(err => console.log(err, 'err getting the data'))
    const openBetsNoTaker = arr.filter(element => {
        if ((element.obj.takerId === '') &&
        (element.obj.userId === id)){
            return true
        }else{
            return false
        }
        })
    const openBetsWithTaker = arr.filter(element => {
        if ((element.obj.takerId !== '') &&
        (element.obj.userId === id) && (element.obj.timeOfCompletion === '')){
            return true
        }else{
            return false
        }
        })
    const closedBets = arr.filter(element => {
        if ((element.obj.takerId !== '') &&
        (element.obj.userId === id) && (element.obj.timeOfCompletion !== '')){
            return true
        }else{
            return false
        }
        })

    return {openBetsNoTaker, openBetsWithTaker, closedBets}
}

export { createNewUser, getUser, updateUser, createNewBet, getBet, getAllBets, getAllBetsbyUser }

//Create User
//Name, Username, Email, Venmo, authToken
//Fetch User
//by: authToken
//Update User
//by: authToken
