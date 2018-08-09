import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FormInput, FormLabel } from "react-native-elements"
import { styles } from "./index"
import axios from 'axios'


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
    fetchFortniteAPI = async () => {
        const searchResult = await axios({
            method: "get",
            url: `https://api.fortnitetracker.com/v1/profile/pc/ninja`,
            headers: {
                "TRN-Api-Key": '06d586eb-f40e-430d-ba02-5e4716654056'
            }
        })
        /*"accountId",
        "platformId",
        "platformName",
        "platformNameLong",
        "epicUserHandle",
        "stats",
        "lifeTimeStats",
        "recentMatches",*/
        console.log(searchResult.data.recentMatches[1])
    }
    render() {
        this.fetchFortniteAPI()
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
