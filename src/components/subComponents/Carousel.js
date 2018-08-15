import Carousel from 'react-native-snap-carousel';
import React, { Component } from "react"
import { View, Text, TouchableOpacity, WebView, Dimensions } from 'react-native';
import { AccountSetupView } from "../index"
import Cards from "./Cards"
// import AuthenticateAccountView from '../AuthenticateAccountView';
// import SingleStreamView from '../SingleStreamView';
export default class MyCarousel extends Component {
    constructor() {
        super()
        this.state = {
            entries: [
                {
                    value: < AccountSetupView />,
                },
                {
                    value: < Cards />,
                },
                {
                    title: 'Earlier this morning, NYC',
                    subtitle: 'Lorem ipsum dolor sit amet',
                    illustration: 'https://i.imgur.com/UPrs1EWl.jpg'
                },
                {
                    title: 'White Pocket Sunset',
                    subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
                    illustration: 'https://i.imgur.com/MABUbpDl.jpg'
                },
                {
                    title: 'Acrocorinth, Greece',
                    subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
                    illustration: 'https://i.imgur.com/KZsmUi2l.jpg'
                },
                {
                    title: 'The lone tree, majestic landscape of New Zealand',
                    subtitle: 'Lorem ipsum dolor sit amet',
                    illustration: 'https://i.imgur.com/2nCt3Sbl.jpg'
                },
                {
                    title: 'Middle Earth, Germany',
                    subtitle: 'Lorem ipsum dolor sit amet',
                    illustration: 'https://i.imgur.com/lceHsT6l.jpg'
                }
            ]
        }
    }

    _renderItem({ item, index }) {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                {item.value}
                {/* <AllStreamView /> */}
                {/* <Text style={{
                    // paddingHorizontal: 30,
                    // backgroundColor: 'black',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>{item.title}</Text> */}
            </View>
        )
        // <View style={{
        //     flex: 1,

        //     // overflow: 'visible',
        //     // flexDirection: "row",
        //     // justifyContent: "center",
        //     // alignItems: "center" // for custom animations
        // }}>
        //     <Text style={{
        //         // paddingHorizontal: 30,
        //         // backgroundColor: 'black',
        //         color: 'rgba(255, 255, 255, 0.9)',
        //         fontSize: 20,
        //         fontWeight: 'bold',
        //         textAlign: 'center'
        //     }}>{item.title}</Text>
        // </View>

    }
    componentDidMount() {
        const { width } = Dimensions.get('window')
        console.log("screen width:", width)
    }
    render() {
        return (
            <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.state.entries}
                renderItem={this._renderItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={300}
            />
        );
    }
}