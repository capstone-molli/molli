import { AuthenticateAccountView, AccountSetupView, AllStreamView, SingleStreamView, UserSetupForm } from "./src/components"
import { createStackNavigator } from 'react-navigation';
import React, { Component } from "react"
import store from "./src/db/store"
import { Provider, connect } from 'react-redux';

const App = createStackNavigator({
  AuthenticateAccountView: { screen: AuthenticateAccountView },
  AccountSetupView: { screen: AccountSetupView },
  AllStreamView: { screen: AllStreamView },
  SingleStreamView: { screen: SingleStreamView },
  UserSetupForm: { screen: UserSetupForm }
});

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Stack />
      </Provider>
    )
  }
}


