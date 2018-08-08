import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from "./index"


export default class AuthenticateAccountView extends Component {
    constructor() {
        super()
        this.state = {}
        this.handlePress = this.handlePress.bind(this)
    }
    static navigationOptions = {
        header: null
    }
    handlePress = () => {
        const { navigate } = this.props.navigation
        navigate("AccountSetupView")
    }
    render() {
        return (
            <View style={styles.maxScreenView}>
                <TouchableOpacity onPress={this.handlePress}>
                    <Text style={styles.text} >Connect Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity >

                    <Text style={styles.text} >Connect Venmo</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
