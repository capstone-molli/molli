import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Button } from 'react-native';
import { styles } from "./index"
import { facebookLogIn } from "../db/facebookAuth"
import * as firebase from "firebase"
import { SocialIcon } from 'react-native-elements'



export default class AuthenticateAccountView extends Component {
    constructor() {
        super()
        this.state = {
        }
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
    componentDidMount = async () => {
        var user = firebase.auth().currentUser;
        if (user) {
            const { navigate } = this.props.navigation
            navigate("setupAccount")
        }
    }
    render() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFF',
            }}>
                <Text style={{ fontSize: 30, color: "#00aa9e", fontFamily: 'SUPRRG', position: "absolute", top: 150 }}>Molli.</Text>
                <TouchableOpacity onPress={this.handlePress}>
                    <SocialIcon
                        title='Sign Up With Facebook'
                        button
                        type='facebook'
                        style={{ width: 325, borderColor: "#FFF", borderWidth: 3 }}
                    />
                </TouchableOpacity>

            </View>
        );
    }
}
