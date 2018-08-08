import React, { Component } from 'react';
import { Text, View, TouchableHighlight, Image, TouchableOpacity, ScrollView } from 'react-native';

import { styles } from "./index"

export default class SingleStreamView extends Component {
    constructor() {
        super()
        this.state = { visible: false }
        this.contract = this.constract.bind(this)
        this.expand = this.expand.bind(this)
    }
    constract() {
        this.setState({ visible: false })
    }
    expand() {
        this.setState({ visible: true })
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 / 3, backgroundColor: "#228B22" }}>
                //Embed twitch stream here
                </View>
                <View style={{ flex: 2 / 3 }}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end", right: 15, bottom: 15, position: "absolute" }}>
                        <TouchableHighlight onPress={this.props.expand}>
                            <Image style={{ width: 80, height: 80 }} source={require('../assets/plus.png')} />
                        </TouchableHighlight>
                    </View>
                </View>

            </View>
        )
    }
}
