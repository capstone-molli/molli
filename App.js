import { AuthenticateAccountView, AccountSetupView, AllStreamView, SingleStreamView, UserSetupForm } from "./src/components"
import { Text, Image } from "react-native"
import { Container, Content, Header, Left, Body, Icon } from "native-base"
import { createDrawerNavigator, createStackNavigator, DrawerItems } from "react-navigation"
import Ionicons from "react-native-vector-icons/Ionicons"
import React, { Component } from "react"

// const App = createStackNavigator({
//   AuthenticateAccountView: { screen: AuthenticateAccountView },
//   AccountSetupView: { screen: AccountSetupView },
//   AllStreamView: MyNavigator,
//   SingleStreamView: { screen: SingleStreamView },
// });

const createAccount = createStackNavigator({
  AuthenticateAccountView: {
    screen: AuthenticateAccountView,


  },
  AccountSetupView: {
    screen: AccountSetupView,


  },

})

const streamingPages = createStackNavigator({
  AllStreamView: AllStreamView,
  SingleStreamView: SingleStreamView
})

const signedIn = createDrawerNavigator({
  AllStreamView: AllStreamView,
  SingleStreamView: SingleStreamView
})

const stack = createStackNavigator({
  // signedOut: {
  //   screen: createAccount,
  //   navigationOptions: {
  //     header: null,
  //     gesturesEnabled: false,
  //   }
  // },
  signedIn: {
    screen: signedIn,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  }
})

export default stack
