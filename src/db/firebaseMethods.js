import firestore from "./firebase"
import * as firebase from 'firebase';
import { NavigationActions } from "react-navigation"
import { Alert } from "react-native"

function addNewChat(obj) {
    return firestore.collection("chatRoom").doc(`${obj._id}`).set(obj)
}
async function listenForBets() {
    const userId = firebase.auth().currentUser.uid
    await firestore.collection("bets").where("userId", "==", userId).onSnapshot(snap => {
        snap.forEach(async (s) => {
            const betYours = s.data()
            if (["Win", "Lose"].includes(betYours.status) && ["", null].includes(betYours.winnerId)) {
                if (betYours.betType === betYours.status) {
                    Alert.alert(
                        `You won a bet on ${betYours.epicUser}!`,
                        'Press OK to dismiss',
                        [
                            { text: 'OK', onPress: () => values = {} },
                        ],
                        { cancelable: false }
                    )
                    if (s._key.path.segments[6]) {
                        await firestore.collection("bets").doc(s._key.path.segments[6]).update({ winnerId: userId })
                    }
                } else {
                    if (s._key.path.segments[6]) {
                        await firestore.collection("bets").doc(s._key.path.segments[6]).update({ winnerId: betYours.takerId })
                    }
                }
            }
        })
    })
    await firestore.collection("bets").where("takerId", "==", userId).onSnapshot(snap => {
        snap.forEach(async (s) => {
            const betYours = s.data()
            if (["Win", "Lose"].includes(betYours.status) && ["", null].includes(betYours.winnerId)) {
                if (betYours.betType !== betYours.status) {
                    Alert.alert(
                        `You won a bet on ${betYours.epicUser}!`,
                        'Press OK to dismiss',
                        [
                            { text: 'OK', onPress: () => values = {} },
                        ],
                        { cancelable: false }
                    )
                }
            }
        })
    })
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
    return firestore.collection("users").doc(obj.id).set(obj)
}

async function updateUserCredits(id, amount) {
    // const currentBalance = await getUser(id).balance
    // console.log("balance:", currentBalance)
    let db = firebase.firestore();
    firebase.firestore().collection("users")
        .where('id', '==', id)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // console.log(doc)
                db.collection("users").doc(doc.id).update({ balance: amount })
            })
        })
}

function createNewUser(obj) {
    return firestore.collection("users").doc(obj.id).set(obj)
}

function createNewBet(obj) {
    return firestore.collection('bets').add(obj)
}

// async function updateCurrentStats(user) {
//     const beta = functions.config().betafortniteapi
//     let fortniteAPI = new Fortnite(
//         [
//             beta.user,
//             beta.password,
//             beta.clienttoken,
//             beta.gametoken
//         ]
//     )
//     const epicUser = await firestore.collection("twitch").doc(user).get().then(epicInfo => epicInfo.data().epicName)
//     console.log('epicUser', epicUser);
//     fortniteAPI.login().then(() => {
//         fortniteAPI.getStatsBR(epicUser, "pc", "alltime").then(result => {
//             firestore.collection("players2").doc(user).update(result)
//         })
//     })
// }

function takeBet(betObj, userId) {
    let db = firebase.firestore();

    firebase.firestore().collection("bets")
        .where('userId', '==', betObj.userId)
        .where('betType', '==', betObj.betType)
        .where('betAmount', '==', betObj.betAmount)
        .where('timeOfCreation', '==', betObj.timeOfCreation)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // Build doc ref from doc.id
                db.collection("bets").doc(doc.id).update({ takerId: userId });
            });
        })
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
            (element.userId === id || element.takerId === id) && (element.timeOfCompletion === '')) {
            return true
        } else {
            return false
        }
    })
    const closedBets = arr.filter(element => {
        if ((element.takerId !== '') &&
            (element.userId === id || element.takerId === id) && (element.timeOfCompletion !== '')) {
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

async function chargeUser(token, amount) {
    const res = await fetch("https://us-central1-molli-e1c3f.cloudfunctions.net/charge/", {
        method: 'POST',
        body: JSON.stringify({
            token,
            charge: {
                amount: amount * 100,
                currency: "usd",
            },
        }),
    });
    const data = await res.json();
    data.body = JSON.parse(data.body);
    return data;
}





export { chargeUser, createNewUser, getUser, updateUser, takeBet, createNewBet, getAllBets, getAllBetsbyUser, logOut, addNewChat, listenForNewChats, retrieveUserInfo, retrieveAllChats, listenForBets, updateUserCredits }


//Create User
//Name, Username, Email, Venmo, authToken
//Fetch User
//by: authToken
//Update User
//by: authToken
