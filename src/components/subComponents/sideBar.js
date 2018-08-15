import React, { Component } from "react"
import { AuthenticateAccountView, AccountSetupView, AllStreamView, SingleStreamView, UserSetupForm } from "../../components"
import { SafeAreaView, createDrawerNavigator, createStackNavigator, DrawerItems, Dimensions, NavigationActions } from "react-navigation"
import styles from "../styles"
import * as firebase from "firebase"
import { getUser } from "../../db/firebaseMethods"
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image
} from "react-native";


class CustomDrawerContentComponent extends Component {
    constructor() {
        super()
        this.state = {}
    }
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }
    async componentDidMount() {
        var user = firebase.auth().currentUser
        const userId = user.uid
        const newUser = await getUser(userId)
        console.log("user object:", newUser)
        this.setState({ user: newUser })
    }
    render() {
        return this.state.user ? (
            <ScrollView style={{ borderBottomRightRadius: 30, borderTopRightRadius: 30, backgroundColor: "#fff" }}>
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={{ flex: 3 / 10, alignItems: "center" }}>
                        <TouchableOpacity>
                            <Image style={styles.avatar} source={{ uri: this.state.user.obj.picture || "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg" }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 7 / 10, paddingLeft: 20 }}>
                        <TouchableOpacity onPress={this.navigateToScreen('AllStreamView')} style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/home.png")} />
                                <Text style={{ fontSize: 20 }}>Home</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('AllStreamView')} style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/history.png")} />
                                <Text style={{ fontSize: 20 }}>History</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('AllStreamView')} style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/active.png")} />
                                <Text style={{ fontSize: 20 }}>Active</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('AllStreamView')} style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/settingsImg.png")} />
                                <Text style={{ fontSize: 20 }}>Settings</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView >
        ) : (<View />)
    };
}

export default CustomDrawerContentComponent