import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from "./index"
import Expo from "expo"
import { facebookLogIn } from "../db/facebookAuth"

export default class AuthenticateAccountView extends Component {
    constructor() {
        super()
        this.state = {}
        this.handlePress = this.handlePress.bind(this)
    }
    static navigationOptions = {
        header: null
    }

    handlePress = async () => {
        const { navigate } = this.props.navigation
        const userData = await facebookLogIn()
        console.log("user data: beans", userData)
        navigate("AccountSetupView", { data: userData })
    }
    render() {
        return (
            <View style={styles.maxScreenView}>
                <TouchableOpacity onPress={this.handlePress}>
                    <Text style={styles.text} >Connect Facebook</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
