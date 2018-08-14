import Swiper from "react-native-deck-swiper"
import React, { Component } from 'react';
import { Text, View, TouchableHighlight, Image, TouchableOpacity, ScrollView, Button } from 'react-native';
import { FormInput, FormLabel } from "react-native-elements"
import { styles } from "../index"

export default class SwiperComponent extends Component {
    render() {
        return (
            <Swiper
                cards={this.props.cards}
                renderCard={(card) => {
                    console.log(card, 'this is the swiper comp')
                    return (
                        <View style={styles.card}>
                            <Text style={styles.text}>{card}</Text>
                        </View>
                    )
                }}
                onSwipedRight={(swipe) => {console.log(swipe, 'swiped left')}}
                onSwiped={(cardIndex) => { console.log(cardIndex) }}
                onSwipedAll={() => { console.log('onSwipedAll') }}
                cardIndex={0}
                backgroundColor={'#4FD0E9'}
                stackSize={3}>
            </Swiper>
        )
    }
}
