import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, WebView } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
import styles from './styles'
import axios from 'axios'
import { twitchData } from "../db/twitchData"
import { getAllBetsbyUser } from '../db/firebaseMethods'
import * as firebase from "firebase"

export default class BetHistory extends Component {
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
        this.setState({
            user: firebase.auth().currentUser.uid,

        })
        this.setState({
            bets: await getAllBetsbyUser(user)
        })
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
                    <View style={{ flex: 18 / 20, backgroundColor: "#FFF" }}>
                        <ScrollView>
                            <View > <Text style={styles.titleText} onPress={this.onPressTitle}>
                                Closed Bets
                                </Text>
                                {this.state.bets.closedBets.length !== 0 ? this.state.bets.closedBets.map(bet => {
                                    return (
                                        <Card key={bet.epicUser}
                                            title={`${new Date().toLocaleString()}`}>
                                            <Text style={{ marginBottom: 10 }}>
                                                {bet.betAmount} on {bet.epicUser} {bet.betType === "Win" ? "winning" : "losing"}
                                            </Text>
                                        </Card>
                                    )

                                }) : <Text>No closed bets right now</Text>}
                            </View>
                        </ScrollView>
                    </View>

                </View>)
    }
}