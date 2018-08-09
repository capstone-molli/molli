import React from "react"
import firestore from "./firebase"
import { createNewUser } from "./firebaseMethods"

const facebookLogIn = async () => {
    let userData = {}
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1926350514326999', {
        permissions: ["public_profile", "email"],
    });
    if (type === 'success') {
        const response = await fetch(`https://graph.facebook.com/me?fields=email,name,first_name,last_name,id,picture&access_token=${token}`)
        const data = await response.json()
        console.log("data", data)
        const obj = {
            name: data.name,
            first_name: data.first_name,
            last_name: data.last_name,
            picture: data.picture,
            email: data.email
        }
        createNewUser(data.id, obj)
        userData = data
    }
    return userData
}


export { facebookLogIn }