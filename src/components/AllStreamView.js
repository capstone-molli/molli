import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, WebView } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
import axios from 'axios'
import { twitchData } from "../db/twitchData"
import * as firebase from "firebase"

export default class AllStreamView extends Component {
    constructor() {
        super()
        this.state = { streams: [], loading: true }
        this.expandProfileCard = this.expandProfileCard.bind(this)
        this.handlePress = this.handlePress.bind(this)
    }
    static navigationOptions = {
        header: null
    }
    async componentDidMount() {
        const streams = await twitchData()
        this.setState({
            streams
        })
        var user = firebase.auth().currentUser
        setTimeout(() => this.setState({ loading: false }), 1000);
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

    render() {

        return this.state.loading ? (<View style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Image style={{ width: 300, height: 300 }} source={require("../assets/loading.gif")} />
        </View>) : (
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
                                                    navigate("SingleStreamView", { display: stream.user.display_name, login: stream.user.login })
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
