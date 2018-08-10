import { AuthenticateAccountView, AccountSetupView, AllStreamView, SingleStreamView, UserSetupForm } from "./src/components"
import { createStackNavigator } from 'react-navigation';
import React, { Component } from "react"


const App = createStackNavigator({
   AuthenticateAccountView: { screen: AuthenticateAccountView },
   AccountSetupView: { screen: AccountSetupView },
  AllStreamView: { screen: AllStreamView },
  SingleStreamView: { screen: SingleStreamView },
  UserSetupForm: { screen: UserSetupForm }
});

export default App


