import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { FormInput, FormLabel } from "react-native-elements"
import { styles } from "./index"
import UserSetupForm from "./subComponents/UserSetupForm"

export default class AccountSetupView extends Component {
    static navigationOptions = {
        header: null
    }
    navigateToAllStreams = (user) => {
        const { navigate } = this.props.navigation
        navigate("AllStreamView", {user})
    }
    render() {
        return (
            <View style={styles.maxScreenView}>
                <UserSetupForm user={this.props.navigation.state.params.data} navigateToAllStreams={this.navigateToAllStreams} />
            </View>
        )
    }
}


