import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { FormInput, FormLabel } from "react-native-elements"
import { styles } from "./index"
import UserSetupForm from "./subComponents/UserSetupForm"
import * as firebase from "firebase"
import { getUser } from '../db/firebaseMethods';

export default class AccountSetupView extends Component {
    constructor() {
        super()
        this.state = { user: null }
        this.navigateToAllStreams = this.navigateToAllStreams.bind(this)
    }
    static navigationOptions = {
        header: null
    }
    navigateToAllStreams = () => {
        const { navigate } = this.props.navigation
        navigate("signedIn")
    }
    async componentDidMount() {
        var user = firebase.auth().currentUser
        const userId = user.uid
        const newUser = await getUser(userId)

        this.setState({ user: newUser })
    }
    render() {
        return !this.state.user ? (<View style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" }}>
            <Image style={{ width: 300, height: 300 }} source={require("../assets/loading-1.gif")} />
        </View>) : (
                <View style={{
                    backgroundColor: "#FFF", flex: 1,
                    alignItems: 'center',
                    flexDirection: "row",
                    justifyContent: 'center',

                }
                }>
                    <UserSetupForm user={this.state.user} navigateToAllStreams={this.navigateToAllStreams} />
                </View>
            )
    }
}


