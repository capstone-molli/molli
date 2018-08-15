import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, WebView } from 'react-native';
import { Card, Button, Icon, Header, Divider } from 'react-native-elements'
import styles from './styles'
import axios from 'axios'
import { twitchData } from "../db/twitchData"
import {getAllBetsbyUser} from '../db/firebaseMethods'
import * as firebase from "firebase"

export default class ActiveBets extends Component {
    constructor(){
        super()
        this.state = {
            user: null,
            bets: null,
            loading: true
        }
        this.expandProfileCard = this.expandProfileCard.bind(this)
    }

    async componentDidMount(){
        const user = firebase.auth().currentUser.uid
        console.log('user : ', user );
        this.setState({ 
            user
        })
        console.log(this.state.user)
        this.setState({
            bets: await getAllBetsbyUser(user)
        })
        //console.log(this.state.bets)
        setTimeout(() => this.setState({ loading: false }), 1000);
    }

    expandProfileCard() {
        this.props.navigation.openDrawer()
    }


    render(){
        console.log('bets',this.state.bets)
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
                        
                        <View > <Text style={styles.titleText} onPress={this.onPressTitle}>
                                Open Bets With A taker
                                </Text>
                            {this.state.bets.openBetsWithTaker.length !== 0  ? this.state.bets.openBetsWithTaker.map(bet => {
                                return (
                                        <Card
                                            title={'User Bet Was Placed On: '+ bet.obj.epicUser}>
                                            <Text style={{marginBottom: 10}}>
                                                {'Bet Type: '}{bet.obj.betType}
                                            </Text>
                                            <Text style={{marginBottom: 10}}>
                                                {'Bet Amount: $'}{bet.obj.betAmount}
                                            </Text>
                                        </Card>
                                     )

                            }) : <View><Text>No open bets with takers right now</Text></View>}
                        </View>
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <View > <Text style={styles.titleText} onPress={this.onPressTitle}>
                                Open Bets Without A taker
                                </Text>
                            {this.state.bets.openBetsNoTaker.length !== 0 ? this.state.bets.openBetsNoTaker.map(bet => {
                                return (
                                    <Card key = {bet.obj.epicUser}
                                    title={'User Bet Was Placed On: '+ bet.obj.epicUser}>
                                        <Text style={{marginBottom: 10}}>
                                            {'Bet Type: '}{bet.obj.betType}
                                        </Text>
                                        <Text style={{marginBottom: 10}}>
                                            {'Bet Amount: $'}{bet.obj.betAmount}
                                        </Text>
                                    </Card>
                                     )

                            }) : <Text>No open bets with no takers right now</Text>}
                        </View>
                    </ScrollView>
                </View>
        </View>)
    }
}