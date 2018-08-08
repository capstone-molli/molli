import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FormInput, FormLabel } from "react-native-elements"
import { styles } from "./index"


export default class AllStreamView extends Component {
    constructor() {
        super()
        this.state = {}
        this.expandProfileCard = this.expandProfileCard.bind(this)
    }
    static navigationOptions = {
        header: null
    }
    expandProfileCard() {

    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 2 / 20, backgroundColor: "#228B22" }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 2 / 10, flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                            <TouchableOpacity onPress={this.expandProfileCard}>
                                <Image style={{ width: 30, height: 30, bottom: 20 }} source={require("../assets/settings.png")} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 8 / 10 }}>
                            <View>

                            </View>

                        </View>

                    </View>
                </View>
                <View style={{ flex: 18 / 20 }}>
                    <ScrollView>
                        <View>

                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}
