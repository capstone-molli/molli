import Carousel from 'react-native-snap-carousel';
import React, { Component } from "react"
import { View, Text, TouchableOpacity, WebView, Dimensions, Image } from 'react-native';
import Cards from "./Cards"
import TinderCards from "./TinderCards"
import ChatRoom from "./ChatRoom"
import AccountBalance from './AccountBalance'


export default class MyCarousel extends Component {
    constructor() {
        super()
        this._renderItem = this._renderItem.bind(this)
        this.state = {
            entries: [
                {
                    value: <ChatRoom />
                },
                {
                    value: < TinderCards />,

                },
                {
                    // title: 'White Pocket Sunset',
                    // subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
                    // illustration: 'https://i.imgur.com/MABUbpDl.jpg'
                    value: <AccountBalance />
                },
            ]
        }
    }
    _renderItem({ item, index }) {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF', justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => this._carousel.snapToPrev()}>
                    {index === 1 && (<Image style={{ height: 30, width: 30 }} source={require("../../assets/chatBlueInverted.png")} />)}
                    {index === 2 && (<Image style={{ height: 30, width: 30 }} source={require("../../assets/cardsBlueInverted.png")} />)}
                </TouchableOpacity>
                {item.value}
                <TouchableOpacity onPress={() => this._carousel.snapToNext()}>
                    {index === 0 && (<Image style={{ height: 30, width: 30 }} source={require("../../assets/cardsBlueInverted.png")} />)}
                    {index === 1 && (<Image style={{ height: 30, width: 30 }} source={require("../../assets/paymentsBlue.png")} />)}
                </TouchableOpacity>
            </View>
        )
    }
    componentDidMount() {
        const { width } = Dimensions.get('window')
    }
    render() {
        return (
            <Carousel
                ref={(c) => { this._carousel = c }}
                data={this.state.entries}
                renderItem={this._renderItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width}
                scrollEnabled={false}
                firstItem={1}
            />
        )
    }
}