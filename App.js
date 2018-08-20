
import { AuthenticateAccountView, SettingsView, AccountSetupView, AllStreamView, SingleStreamView, UserSetupForm, BetHistory, ActiveBets } from "./src/components"
import { SafeAreaView, createDrawerNavigator, createStackNavigator, DrawerItems, Dimensions, NavigationActions } from "react-navigation"
import styles from "./src/components/styles"
import CustomDrawerContentComponent from "./src/components/subComponents/sideBar"
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar
} from "react-native";
import React, { Component } from "react"
import * as firebase from "firebase"
import { getUser } from "./src/db/firebaseMethods"
import { Font } from 'expo';
const SUPRRG = require("./src/assets/SUPRRG.ttf")
const MPR = require("./src/assets/MPR.ttf")



const streams = createDrawerNavigator({
  AllStreamView: { screen: AllStreamView },
  SingleStreamView: { screen: SingleStreamView },
  SettingsView: { screen: SettingsView },
  BetHistory: { screen: BetHistory },
  ActiveBets: { screen: ActiveBets },
},
  {
    contentComponent: CustomDrawerContentComponent,
    drawerBackgroundColor: "transparent",

  },

)


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
    screen: streams,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  }
})
const SignedInStack = createStackNavigator({
  signedIn: {
    screen: streams,
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
      newUser: null,
      fontLoaded: false
    };
  }

  async componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const newUser = await getUser(user.uid)
        if (newUser && newUser.exists === true) {
          this.setState({
            loading: false,
            newUser: newUser,
            user: user
          })
        } else {
          this.setState({
            loading: false,
            user: user
          });
        }
      } else {
        this.setState({
          loading: false,
        })
      }
    })
    await Font.loadAsync({
      'SUPRRG': SUPRRG,
      "MPR": MPR
    });
    this.setState({ fontLoaded: true })
  }
  componentWillUnmount() {
    this.authSubscription()
  }
  render() {
    if (this.state.loading) return null;
    if (this.state.user && this.state.newUser && this.state.fontLoaded) return (<React.Fragment> <StatusBar hidden={true} /> <SignedInStack /></React.Fragment>)
    return (<React.Fragment><StatusBar hidden={true} /> <SignedOutStack /></React.Fragment>)
  }

}

