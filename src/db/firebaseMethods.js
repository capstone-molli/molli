import firestore from "./firebase"

function getUser(id) {
    firestore.collection("users").doc(id).get().then(user => user.data())
}

function updateUser(id, obj) {
    return firestore.collection("users").doc(`${id}`).set({ obj })
}


function createNewUser(id, obj) {
    return firestore.collection("users").doc(`${id}`).set({ obj })
}

export { createNewUser, getUser, updateUser }
//create a firebase method that creates a new user object using 
//id
// first_name
// last_name
// middle_name
// name
// name_format
// picture
// short_name


//Create User
//Name, Username, Email, Venmo, authToken
//Fetch User
//by: authToken
//Update User
//by: authToken
