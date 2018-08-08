import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FormInput, FormLabel } from "react-native-elements"
import { styles } from "./index"
const Fortnite = require("fortnite-api");

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


        const fortniteAPI = new Fortnite(
            [
                "knthslai@gmail.com",
                "mollipasswordAPI1",
                "MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=",
                "ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ="
            ],
            {
                debug: true
            }
        );
        fortniteAPI.login().then(() => {
            fortniteAPI
                .getStatsBR("Mirardes", "pc", "weekly")
                .then(stats => {
                    console.log(stats);
                })
                .catch(err => {
                    console.log(err);
                });
        });
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
