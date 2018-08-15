import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { FormInput, FormLabel } from "react-native-elements"
import { styles } from "./index"
import UserSetupForm from "./subComponents/UserSetupForm"
import * as firebase from "firebase"
import { getUser } from '../db/firebaseMethods';

export default class SettingsView extends Component {
    constructor() {
        super()
        this.state = { user: null }
    }
    static navigationOptions = {
        header: null
    }
    async componentDidMount() {
        var user = firebase.auth().currentUser
        const userId = user.uid
        const newUser = await getUser(userId)
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

