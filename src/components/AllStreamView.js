import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, WebView } from 'react-native';
import { FormInput, FormLabel } from "react-native-elements"
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { styles, SingleStreamView } from "./index"
import axios from 'axios'
import { twitchData } from "../db/twitchData"

export default class AllStreamView extends Component {
    constructor() {
        super()
        this.state = { streams: [] }
        this.expandProfileCard = this.expandProfileCard.bind(this)
        this.handlePress = this.handlePress.bind(this)
        // this.getVideos = this.getVideos.bind(this)
    }
    static navigationOptions = {
        header: null
    }
    async componentDidMount() {
        const streams = await twitchData()
        this.setState({
            streams
        })
    }

    async getUsers(streams) {
        let users = []
        //return video.data.data[0]
        //console.log('USERS', video.data.data[0])
    }

    handlePress = (stream) => {
        const { navigate } = this.props.navigation
        navigate("SingleStreamView", { display: stream.user.display_name, login: stream.user.login })
    }
    expandProfileCard() {
        this.props.navigation.openDrawer()
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

                        <View >
                            {this.state.streams.map(stream => {
                                let url = stream.video.thumbnail_url.slice(0, stream.video.thumbnail_url.length - 20) + '200x100.jpg'
                                return (
                                    <View key={stream.video.id} >
                                        <Card
                                            title={stream.user.display_name}
                                            image={{ uri: stream.user.profile_image_url }}
                                            imageProps={{ imageProperties: { width: 200, height: 100 } }}
                                            style={{ flex: 1 }}>
                                            <Button onPress={() => {
                                                const { navigate } = this.props.navigation
                                                navigate("SingleStreamView", { display: stream.user.display_name, login: stream.user.login, id: this.props.navigation.state.params.id })
                                            }}
                                                icon={<Icon name='code' color='#ffffff' />}
                                                backgroundColor='#03A9F4'
                                                //fontFamily='Lato'
                                                buttonStyle={{ width: "100%", flex: 1 }}
                                                title='view' />
                                        </Card>
                                    </View>)

                            })}
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}
