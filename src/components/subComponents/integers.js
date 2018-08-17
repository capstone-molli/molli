import Carousel from 'react-native-snap-carousel';
import React, { Component } from "react"
import { View, Text, TouchableOpacity, WebView, Dimensions, Image } from 'react-native';

export default class Integers extends Component {
    constructor() {
        super()
        this._renderItem = this._renderItem.bind(this)
        this.state = {
            entries: [
                {
                    title: 0
                },
                {
                    title: 1
                },
                {
                    title: 2
                },
                {
                    title: 3
                },
                {
                    title: 4
                },
                {
                    title: 5
                },
                {
                    title: 6
                },
                {
                    title: 7
                },
                { title: 8 },
                { title: 9 },
                { title: 10 },
            ]
        }
    }
    _renderItem({ item, index }) {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF', justifyContent: "center", flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 40 }}>{item.title}</Text>
            </View>
        )
    }
    componentDidMount() {
        const { width } = Dimensions.get('window')
        console.log("screen width:", width)
    }
    render() {
        return (
            <Carousel
                ref={(c) => { this._carousel = c }}
                data={this.state.entries}
                renderItem={this._renderItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={40}
                scrollEnabled={true}
                firstItem={0}
            />
        );
    }
}