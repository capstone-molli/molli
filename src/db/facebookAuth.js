import React from "react"
import firestore from "./firebase"
import { createNewUser } from "./firebaseMethods"

const facebookLogIn = async () => {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1926350514326999', {
        permissions: ["public_profile"],
    });
    if (type === 'success') {
        const response = await fetch(`https://graph.facebook.com/me?fields=email,first_name,last_name,id,picture&access_token=${token}`)
        const data = await response.json()
        const obj = {
            first_name: data.first_name,
            last_name: data.last_name,
            picture: data.picture
        }
        createNewUser(data.id, obj)
    }
}


export { facebookLogIn }