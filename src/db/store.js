import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import * as firebaseMethods from "./firebaseMethods"
import * as facebookMethods from "./facebookAuth"




const CREATE_USER = "CREATE_USER"
const createUser = (user) => ({
    type: CREATE_USER,
    user
})
export const createNewUser = () => {
    return (dispatch) => {
        const newUser = facebookMethods.facebookLogIn()
        dispatch(createUser(newUser))
        return newUser
    }
}
//reducer

const reducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_USER: return { ...state, user: action.user }
    }
}


export default createStore(reducer, applyMiddleware(thunk))