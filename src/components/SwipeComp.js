import React, { Component } from 'react';
import { View, Image, TouchableOpacity, WebView } from 'react-native';

export default class SwipeComp extends Component {
    render(){
        'this is being rendered in swipe'
        return (
            <View>
                betAmount: {this.props.betAmount}
                betType: {this.props.betType}
                description: {this.props.description}
                epicUser: {this.props.epicUser}
            </View>
        )
    }
}