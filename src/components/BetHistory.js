import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, WebView } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
import axios from 'axios'
import { twitchData } from "../db/twitchData"
import {getAllBetsbyUser} from '../db/firebaseMethods'
import * as firebase from "firebase"

export default class BetHistory extends Component {
    constructor(){
        super()
        this.state = {
            user: {},
            bets: {}
        }
    }

    async componentDidMount(){
        this.setState({ 
            user: firebase.auth().currentUser.uid, 
            
        })
        this.setState({
            bets: await getAllBetsbyUser(this.state.user.id)
        })
    }
    render(){
        <View>
            <View style={{ flex: 18 / 20 }}>
                    <ScrollView>

                        <View > Open Bets With Takers
                            {this.state.bets.openBetsWithTaker ? this.state.bets.openBetsWithTaker.map(bet => {
                                return (
                                    
                                     )

                            }) : <View>No open bets with takers right now :/</View>}
                        </View>

                        <View > Open Bets With Takers
                            {this.state.bets.openBetsNoTaker ? this.state.bets.openBetsNoTaker.map(bet => {
                                return (

                                     )

                            }) : <View>No open bets with no takers right now :/</View>}
                        </View>

                        <View > Open Bets With Takers
                            {this.state.bets.closedBets ? this.state.bets.closedBets.map(bet => {
                                return (
                                    
                                     )

                            }) : <View>No closed bets right now :/</View>}
                        </View>
                    </ScrollView>
                </View>

        </View>
    }
}