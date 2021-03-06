import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, WebView } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
import axios from 'axios'
import { twitchData } from "../db/twitchData"
import * as firebase from "firebase"
import CardModal from './card-modal';
import { getAllBets, listenForBets, setUserCurrentStreamer } from "../db/firebaseMethods"
import styles from './styles'

export default class AllStreamView extends Component {
    constructor() {
        super()
        this.state = {
            streams: [], loading: true, scroll: true
        }
        this.expandProfileCard = this.expandProfileCard.bind(this)
        this.navigateToSingleStream = this.navigateToSingleStream.bind(this)
    }
    static navigationOptions = {
        header: null
    }
    async componentDidMount() {
        const streams = await twitchData()
        listenForBets()
        this.setState({
            streams,
        })
        this.setState({ loading: false })
    }

    disableScroll() {
        this.setState({ scroll: !this.state.scroll });
    }

    expandProfileCard() {
        this.props.navigation.openDrawer()
    }
    navigateToSingleStream = async (stream) => {
        const { navigate } = this.props.navigation
        await setUserCurrentStreamer(stream.user.login)
        navigate("SingleStreamView", { display: stream.user.display_name, login: stream.user.login })
    }

    render() {
        return this.state.loading ? (<View style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" }}>
            <Image style={{ width: 300, height: 300 }} source={require("../assets/loading-1.gif")} />
        </View>) : (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 2 / 20, backgroundColor: "#FFF", flexDirection: "row" }}>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <View style={{ flex: 2 / 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <TouchableOpacity onPress={this.expandProfileCard}>
                                    <Image style={{ width: 30, height: 30, left: 20 }} source={require("../assets/settingsBlack.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 6 / 10, justifyContent: "center" }}>
                                <Text style={{
                                    paddingTop: 20,
                                    alignSelf: "center",
                                    fontSize: 30, color: "#00aa9e", fontFamily: 'SUPRRG'
                                }}>Molli</Text>
                            </View>
                            <View style={{ flex: 2 / 10 }} />
                        </View>

                    </View>
                    <ScrollView scrollEnabled={this.state.scroll} style={{
                        flex: 1,
                        backgroundColor: '#FFF',
                        paddingTop: 20,
                        flex: 18 / 20
                    }}>
                        {this.state.streams.map(stream => {
                            return (
                                <CardModal
                                    key={stream.user.display_name}
                                    title={stream.user.display_name}
                                    description={stream.video.title}
                                    image={{ uri: stream.user.profile_image_url }}
                                    color={"#8b9dc3"}
                                    content={stream.user.description}
                                    onClick={() => this.disableScroll()}
                                    navigateToSingleStream={this.navigateToSingleStream}
                                    stream={stream}
                                />
                            )
                        })}
                    </ScrollView>
                </View >
            )
    }

}
