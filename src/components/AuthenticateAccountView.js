import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from "./index"
import { facebookLogIn } from "../db/facebookAuth"
import * as firebase from "firebase"


export default class AuthenticateAccountView extends Component {
    constructor() {
        super()
        this.handlePress = this.handlePress.bind(this)
    }
    static navigationOptions = {
        header: null
    }
    handlePress = async () => {
        const userData = await facebookLogIn()
        const { navigate } = this.props.navigation
        navigate("setupAccount")
    }
    componentDidMount() {
        var user = firebase.auth().currentUser;
        if (user) {
            const { navigate } = this.props.navigation
            navigate("setupAccount")
        }
    }
    render() {
        return (
            <View style={styles.maxScreenView}>
                <TouchableOpacity onPress={this.handlePress} >
                    <Text style={styles.text} >Connect Facebook</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
