import React from "react"
import firestore from "./firebase"
import * as firebase from 'firebase';
import { createNewUser } from "./firebaseMethods"



const facebookLogIn = async () => {
    let userData = {}
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1926350514326999', {
        permissions: ["public_profile", "email"],
    });
    if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token)
        firebase.auth().signInAndRetrieveDataWithCredential(credential).catch((error) => {
            console.log(error)
        })

        await firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                console.log("We are authenticated now!");
                const obj = {
                    name: user.displayName,
                    picture: user.photoURL,
                    email: user.email,
                    id: user.uid
                }
                userData = obj
                createNewUser(obj)
            }
        });
    }
    return userData
}


export { facebookLogIn }