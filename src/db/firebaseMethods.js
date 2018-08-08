import firestore from "./firebase"

function retrieveUser(id) {

    firestore.collection("users" + `/${id}`).get().then((tests) => {
        tests.forEach((song) => {
            console.log("songs!!", song.data())
            // const songVal = song.data()
            // songData[song.id] = songVal
        })
    });
}

function updateUser(obj) {
    firestore.database().ref('users/' + obj.id).set(obj);
}


function createNewUser(id, obj) {
    firestore.collection("users").doc(`${id}`).set({ obj })
}

export { createNewUser }
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
