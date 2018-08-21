import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, WebView } from 'react-native';
import { Card, Button, Icon, Header, Divider } from 'react-native-elements'
import styles from './styles'
import axios from 'axios'
import { twitchData } from "../db/twitchData"
import { getAllBetsbyUser, getUser } from '../db/firebaseMethods'
import * as firebase from "firebase"

export default class ActiveBets extends Component {
    constructor() {
        super()
        this.state = {
            user: null,
            bets: null,
            loading: true
        }
        this.expandProfileCard = this.expandProfileCard.bind(this)
    }

    async componentDidMount() {
        const user = firebase.auth().currentUser.uid
        const userData = await getUser(user)
        this.setState({
            user
        })
        this.setState({
            bets: await getAllBetsbyUser(user)
        })
        // console.log(this.state.bets)
        setTimeout(() => this.setState({ loading: false }), 1000);
    }

    expandProfileCard() {
        this.props.navigation.openDrawer()
    }


    render() {
        return this.state.loading ? (<View style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" }}>
            <Image style={{ width: 300, height: 300 }} source={require("../assets/loading-1.gif")} />
        </View>) : (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 2 / 20, backgroundColor: "#FFF" }}>
                        <View style={{ flexDirection: "row", flex: 1 }}>
                            <View style={{ flex: 2 / 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <TouchableOpacity onPress={this.expandProfileCard}>
                                    <Image style={{ width: 30, height: 30, left: 20 }} source={require("../assets/settingsBlack.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 8 / 10 }}>
                                <View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 18 / 20, backgroundColor: "#FFF" }}>
                        <ScrollView>

                            <View > <Text style={styles.titleText} onPress={this.onPressTitle}>
                                Matched Bets
                                </Text>
                                {this.state.bets.openBetsWithTaker.length !== 0 ? this.state.bets.openBetsWithTaker.map(bet => {
                                    return (
                                        <Card
                                            title={`${new Date(bet.timeOfCreation.seconds * 1000).toLocaleString()}`}>
                                            <Text style={{ marginBottom: 10 }}>
                                                {bet.betAmount} on {bet.epicUser} {bet.betType === "Win" ? "winning" : "losing"}
                                            </Text>
                                        </Card>
                                    )

                                }) : <View><Text>No Matched Bets Right Now</Text></View>}
                            </View>
                            <Divider style={{ backgroundColor: "#FFF" }} />
                            <Divider style={{ backgroundColor: "#FFF" }} />
                            <Divider style={{ backgroundColor: "#FFF" }} />
                            <View > <Text style={styles.titleText} onPress={this.onPressTitle}>
                                Pending Bets
                                </Text>
                                {this.state.bets.openBetsNoTaker.length !== 0 ? this.state.bets.openBetsNoTaker.map(bet => {
                                    return (
                                        <Card key={bet.epicUser}
                                            title={`${new Date().toLocaleString()}`}>
                                            <Text style={{ marginBottom: 10 }}>
                                                {bet.betAmount} on {bet.epicUser} {bet.betType === "Win" ? "winning" : "losing"}
                                            </Text>
                                        </Card>
                                    )

                                }) : <Text>No Pending Bets</Text>}
                            </View>
                        </ScrollView>
                    </View>
                </View>)
    }
}