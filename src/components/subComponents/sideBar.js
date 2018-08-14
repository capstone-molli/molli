import React, { Component } from "react"
import { AuthenticateAccountView, AccountSetupView, AllStreamView, SingleStreamView, UserSetupForm } from "../../components"
import { SafeAreaView, createDrawerNavigator, createStackNavigator, DrawerItems, Dimensions, NavigationActions } from "react-navigation"
import styles from "../styles"
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image
} from "react-native";


class CustomDrawerContentComponent extends Component {
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }
    componentDidMount() {

    }
    render() {
        return (
            <ScrollView>
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <View style={{ flex: 3 / 10, alignItems: "center" }}>
                        <TouchableOpacity>
                            <Image style={styles.avatar} source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg" }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 7 / 10, paddingLeft: 20 }}>
                        <TouchableOpacity onPress={this.navigateToScreen('AllStreamView')}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 20, height: 20 }} source={require("../../assets/home.png")} />
                                <Text style={{ fontSize: 30 }}>Home</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('AllStreamView')}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 20, height: 20 }} source={require("../../assets/history.png")} />
                                <Text style={{ fontSize: 30 }}>History</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('AllStreamView')}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 20, height: 20 }} source={require("../../assets/active.png")} />
                                <Text style={{ fontSize: 30 }}>Active</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.navigateToScreen('AllStreamView')}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 20, height: 20 }} source={require("../../assets/settingsImg.png")} />
                                <Text style={{ fontSize: 30 }}>Settings</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ScrollView >
        )
    };
}

export default CustomDrawerContentComponent