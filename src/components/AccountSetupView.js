import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { FormInput, FormLabel } from "react-native-elements"
import { styles } from "./index"

export default class AccountSetupView extends Component {
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
        navigate("AllStreamView")
    }
    render() {
        return (
            <View style={styles.maxScreenView}>
                <Image style={styles.avatar} source={{ uri: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" }} />
                <FormLabel labelStyle={styles.text} >Name</FormLabel>
                <FormInput inputStyle={styles.centeredInputText} />
                <FormLabel labelStyle={styles.text} >Username</FormLabel>
                <FormInput inputStyle={styles.centeredInputText} />
                <FormLabel labelStyle={styles.text} >Email</FormLabel>
                <FormInput inputStyle={styles.centeredInputText} />
                <FormLabel labelStyle={styles.text} >Venmo</FormLabel>
                <FormInput inputStyle={styles.centeredInputText} />
                < TouchableOpacity onPress={this.handlePress} >
                    <Text style={styles.text} >Confirm</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


