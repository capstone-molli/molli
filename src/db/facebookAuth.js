import React from "react"
import firestore from "./firebase"
import * as firebase from 'firebase';
import { createNewUser, getUser } from "./firebaseMethods"

const facebookLogOut = () => {
    firebase.auth().signOut()
}

const facebookLogIn = async () => {
    let userData = {}
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1926350514326999', {
        permissions: ["public_profile", "email"],
    });
    if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token)
        await firebase.auth().signInAndRetrieveDataWithCredential(credential).catch((error) => {
            console.log(error)
        })

        await firebase.auth().onAuthStateChanged(async (user) => {
            if (user != null) {
                console.log("We are authenticated now!");
                const photo = await fetch(`https://graph.facebook.com/${user.providerData[0].uid}/picture?redirect=0&height=300&width=300`)
                    .then(res => res.json())
                    .then(r => r.data.url)
                const obj = {
                    name: user.displayName,
                    picture: photo,
                    email: user.email,
                    id: user.uid,
                    exists: false,
                    facebookId: user.providerData[0].uid
                }
                userData = obj

                //search through user database
                //if user exists, return its data. otherwise, return the newly created object.
                createNewUser(obj)
            }
        });
    }
    return userData
}


export { facebookLogIn, facebookLogOut }