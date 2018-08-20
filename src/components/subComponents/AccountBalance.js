import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import * as firebase from "firebase"
import { getUser } from "../../db/firebaseMethods"

class AccountBalance extends Component {
    constructor(){
        super();
        this.state = {
            user: {}
        }
    };

    async componentDidMount() {
        var user = firebase.auth().currentUser
        const userId = user.uid
        const newUser = await getUser(userId)
        this.setState({ user: newUser })
        console.log("user:", newUser)
    }

    render(){
        return (
            <View>
                <View>
                    <TouchableOpacity style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                            <Image style={{ width: 25, height: 25 }} source={require("../../assets/blueBill.png")} />
                            <Text style={{ fontSize: 20 }}>Balance: ${this.state.user.balance}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/addMoney.png")} />
                                <Text style={{ fontSize: 20 }}>Add Credits</Text>
                            </View>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/handDollar.png")} />
                                <Text style={{ fontSize: 20 }}>Donate To Streamer</Text>
                            </View>
                    </TouchableOpacity>
                </View> 
            </View>
        )
    }
}

export default AccountBalance
