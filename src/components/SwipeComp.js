import React, { Component } from 'react';
import { View, Image, TouchableOpacity, WebView } from 'react-native';

export default class SwipeComp extends Component {
    render(){
        'this is being rendered in swipe'
        return (
            <View>
                betAmount: {this.props.bet.betAmount}
                betType: {this.props.bet.betType}
                description: {this.props.bet.description}
                epicUser: {this.props.bet.epicUser}
            </View>
        )
    }
}