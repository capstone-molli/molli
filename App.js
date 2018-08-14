import { AuthenticateAccountView, AccountSetupView, AllStreamView, SingleStreamView, UserSetupForm } from "./src/components"
import { createDrawerNavigator, createStackNavigator, DrawerItems } from "react-navigation"
import React, { Component } from "react"
import * as firebase from "firebase"
import { getUser } from "./src/db/firebaseMethods"

const SignedOutStack = createStackNavigator({
  signedOut: {
    screen: AuthenticateAccountView,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  setupAccount: {
    screen: AccountSetupView,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  signedIn: {
    screen: createDrawerNavigator({
      AllStreamView: AllStreamView,
      SingleStreamView: SingleStreamView
    }),
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  }
})

const SignedInStack = createStackNavigator({
  signedIn: {
    screen: createDrawerNavigator({
      AllStreamView: AllStreamView,
      SingleStreamView: SingleStreamView
    }),
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  }
})

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      user: null,
      newUser: null
    };
  }

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged(async (user) => {
      console.log("authSubscription checked")
      if (user) {
        const newUser = await getUser(user.uid)
        if (newUser && newUser.obj.exists === true) {
          console.log("user exists in auth and database")
          this.setState({
            loading: false,
            newUser: newUser,
            user: user
          })
        } else {
          console.log("user exists only in auth")
          this.setState({
            loading: false,
            user: user
          });
        }
      } else {
        this.setState({
          loading: false,
        })
        console.log("no user authenticated")
      }
    })
  }
  componentWillUnmount() {
    console.log("authSubscription ended")
    this.authSubscription()
  }
  render() {
    if (this.state.loading) return null;
    if (this.state.user && this.state.newUser) return <SignedInStack />;
    return (<SignedOutStack />)
  }
}
