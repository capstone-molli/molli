import React, { Component } from "react"
import { AuthenticateAccountView, AccountSetupView, AllStreamView, SingleStreamView, UserSetupForm } from "../../components"
import { SafeAreaView, createDrawerNavigator, createStackNavigator, DrawerItems, Dimensions, NavigationActions } from "react-navigation"
import styles from "../styles"
import * as firebase from "firebase"
import firestore from "../../db/firebase"
import { getUser } from "../../db/firebaseMethods"
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image
} from "react-native";
import { logOut } from "../../db/firebaseMethods"


class CustomDrawerContentComponent extends Component {
    constructor() {
        super()
        this.state = {
            user: null
        }
        this.listen = this.listen.bind(this)
    }
    navigateToScreen = (route) => () => {
        const Action = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(Action);
        this.props.navigation.closeDrawer()

    }
    async componentDidMount() {
        var user = firebase.auth().currentUser
        const userId = user.uid
        const newUser = await getUser(userId)
        this.setState({ user: newUser })
        // console.log("user:", newUser)
        this.listen()
    }
    async listen() {
        await firestore.collection('users')
            .doc(this.state.user.id)
            .onSnapshot(snap => {
                this.setState({ user: snap.data() })
            })
    }
    render() {
        return this.state.user ? (
            <ScrollView style={{ borderBottomRightRadius: 30, borderTopRightRadius: 30, backgroundColor: "#fff" }}>
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={{ flex: 3 / 10, alignItems: "center" }}>
                        <TouchableOpacity onPress={this.navigateToScreen('SettingsView')}>
                            <Image style={styles.avatar} source={{ uri: this.state.user.picture || "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg" }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 7 / 10, paddingLeft: 20 }}>
                        <TouchableOpacity style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/blueBill.png")} />
                                <Text style={{ fontSize: 20 }}>Balance: {this.state.user.balance}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('AllStreamView')} style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/blueHome.png")} />
                                <Text style={{ fontSize: 20 }}>Home</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('BetHistory')} style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/blueHistory.png")} />
                                <Text style={{ fontSize: 20 }}>History</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('ActiveBets')} style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/activeBlue.png")} />
                                <Text style={{ fontSize: 20 }}>Active</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('SettingsView')} style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/settingsBlue.png")} />
                                <Text style={{ fontSize: 20 }}>Settings</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            logOut()
                            this.navigateToScreen("AuthenticateAccountView")
                        }} style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/logoutBlue.png")} />
                                <Text style={{ fontSize: 20 }}>Log Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView >
        ) : (<View />)
    };
}

export default CustomDrawerContentComponent