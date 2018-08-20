import React, { Component } from 'react';
import { View, Image, TouchableOpacity, WebView } from 'react-native';
import Swiper from "./subComponents/SwiperComponent"
import SlideUpPanel from "./subComponents/SlideUpPanel"
import resolveAssetSource from 'resolveAssetSource';
import Carousel from "./subComponents/Carousel"
import Cards from "./subComponents/Cards"


// import { access } from 'fs';
//import ReactPlayer from 'react-player'


export default class SingleStreamView extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            allowDragging: true,
            loading: true
        }
        this.viewUp = this.viewUp.bind(this)
        this.viewDown = this.viewDown.bind(this)
    }
    goBack = () => {
        const { navigate } = this.props.navigation
        // this.props.navigation.goBack()
        navigate("AllStreamView")
    }

    viewUp = () => {
        this.setState({ visible: true })
        this.refs["plusButton"].setNativeProps({

            source: [resolveAssetSource(require("../assets/empty.png"))]
        })


    }
    viewDown = () => {
        this.setState({ visible: false })
        this.refs["plusButton"].setNativeProps({

            source: [resolveAssetSource(require("../assets/plus.png"))]
        })


    }
    componentDidMount() {
        setTimeout(() => this.setState({ loading: false }), 1000);
    }
    render() {
        return this.state.loading ? (<View style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" }}>
            <Image style={{ width: 300, height: 300 }} source={require("../assets/loading-1.gif")} />
        </View>) : (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 5 / 12, backgroundColor: "#FFF" }}>
                        <View style={{ flex: 2 / 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                            <TouchableOpacity onPress={this.goBack}>
                                <Image style={{ width: 40, height: 40, left: 10 }} source={require("../assets/back.png")} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 8 / 10 }}>
                            <WebView
                                allowsInlineMediaPlayback={true}
                                mediaPlaybackRequiresUserAction={false}
                                bounces={false}
                                source={{ uri: `http://player.twitch.tv/?channel=${this.props.navigation.state.params.login}` }}
                                style={{ marginTop: 0 }}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 7 / 12 }}>
                        <Carousel />
                        <SlideUpPanel visible={this.state.visible} allowDragging={this.state.allowDragging} props={this.props.navigation.state.params} viewDown={this.viewDown} />
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", right: 15, top: 15, position: "absolute" }}>
                            <TouchableOpacity activeOpacity={this.state.visible ? 1 : 0.5} onPress={this.viewUp}>
                                <Image ref="plusButton" style={{ width: 80, height: 80, zIndex: 1 }} source={require('../assets/plus.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
            )
    }
}
