import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Swiper from "./subComponents/SwiperComponent"
import SlideUpPanel from "./subComponents/SlideUpPanel"
import resolveAssetSource from 'resolveAssetSource';


export default class SingleStreamView extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            allowDragging: true,
        }
        this.toggleView = this.toggleView.bind(this)
    }

    toggleView() {
        this.setState({ visible: !this.state.visible })
        this.refs["plusButton"].setNativeProps({
            source: [this.state.visible ? resolveAssetSource(require("../assets/plus.png")) : resolveAssetSource(require("../assets/save.png"))]
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 / 3, backgroundColor: "#228B22" }}>
                //Embed twitch stream here
                </View>
                <View style={{ flex: 2 / 3 }}>
                    //insert card date here in cards prop
                    <Swiper cards={['DO', 'MORE', 'OF', 'WHAT', 'MAKES', 'YOU', 'HAPPY']} />
                    <SlideUpPanel visible={this.state.visible} allowDragging={this.state.allowDragging} />
                    <View style={{ flexDirection: "row", justifyContent: "flex-end", right: 15, bottom: 15, position: "absolute" }}>
                        <TouchableOpacity onPress={this.toggleView}>
                            <Image ref="plusButton" style={{ width: 80, height: 80 }} source={require('../assets/plus.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
