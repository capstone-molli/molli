import firestore from "./firebase"
import * as firebase from 'firebase';
import { NavigationActions } from "react-navigation"


function addNewChat(obj) {
    return firestore.collection("chatRoom").doc(`${obj._id}`).set(obj)
}

async function listenForNewChats() {
    let arr = []
    await firestore.collection('chatRoom').onSnapshot(snap => {
        snap.forEach((s) => arr.push(s.data()))
        console.log("data", arr.sort(function (a, b) { return a.createdAt.seconds - b.createdAt.seconds }))
    })
    return arr.sort(function (a, b) { return a.createdAt.seconds - b.createdAt.seconds })
}
async function retrieveAllChats() {
    const arr = []
    const chats = await firestore.collection('chatRoom').get()
        .then(allChats =>
            allChats.forEach(chat =>
                arr.push(chat.data())
            )
        ).catch(err => console.log(err, 'err getting the chat data'))
    return arr.sort(function (a, b) { return b.createdAt.seconds - a.createdAt.seconds })
}




// var db = admin.database();
// var ref = db.ref("server/saving-data/fireblog/posts");

// // Attach an asynchronous callback to read the data at our posts reference
// ref.on("value", function(snapshot) {
//   console.log(snapshot.val());
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });


async function retrieveUserInfo() {
    var user = firebase.auth().currentUser
    const userId = user.uid
    const newUser = await getUser(userId)
    return newUser
}



function getUser(id) {
    return firestore.collection("users").doc(id).get().then(user => user.data())
}

function updateUser(obj) {
    return firestore.collection("users").doc(`${obj.id}`).set(obj)
}

function createNewUser(obj) {
    return firestore.collection("users").doc(`${obj.id}`).set(obj)
}

function createNewBet(obj) {
    return firestore.collection('bets').add(obj)
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
    const filtered = arr.filter(element => element.takerId === "" && element.userId !== id)

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
    const filtered = arr.filter(element => element.takerId === "")

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
        if ((element.takerId === '') &&
            (element.userId === id)) {
            return true
        } else {
            return false
        }
    })
    const openBetsWithTaker = arr.filter(element => {
        if ((element.takerId !== '') &&
            (element.userId === id) && (element.timeOfCompletion === '')) {
            return true
        } else {
            return false
        }
    })
    const closedBets = arr.filter(element => {
        if ((element.takerId !== '') &&
            (element.userId === id) && (element.timeOfCompletion !== '')) {
            return true
        } else {
            return false
        }
    })

    return { openBetsNoTaker, openBetsWithTaker, closedBets }
}
async function logOut() {
    //get current user id
    const userId = firebase.auth().currentUser.uid
    //get current user 
    const currentUser = await getUser(userId)
    //update logged in property of user object to false
    currentUser.loggedIn = false
    //update user object in firestore
    await updateUser(currentUser)
    //navigate to authenticate account view

    //create logic to prevent user from navigating to allstreams view without (1) facebook oath and (2) logged in property set to "true"
}




export { createNewUser, getUser, updateUser, createNewBet, getBet, getAllBets, getAllBetsbyUser, logOut, addNewChat, listenForNewChats, retrieveUserInfo, retrieveAllChats }

//Create User
//Name, Username, Email, Venmo, authToken
//Fetch User
//by: authToken
//Update User
//by: authToken
