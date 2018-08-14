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
        console.log("user from Firebase", newUser)
        this.setState({ user: newUser })
    }
    render() {
        return this.state.user && (
            <View style={styles.maxScreenView}>
                <UserSetupForm user={this.state.user} navigateToAllStreams={this.navigateToAllStreams} />
            </View>
        )
    }
}


