import React, { Component } from 'react';
import { View, Image, TouchableOpacity, WebView } from 'react-native';
import Swiper from "./subComponents/SwiperComponent"
import SlideUpPanel from "./subComponents/SlideUpPanel"
import resolveAssetSource from 'resolveAssetSource';
import {getBet, getAllBets} from '../db/firebaseMethods'
import SwipeComp from './SwipeComp'
// import { access } from 'fs';
//import ReactPlayer from 'react-player'


export default class SingleStreamView extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            allowDragging: true,
            bets: []
        }
        this.toggleView = this.toggleView.bind(this)
    }

    componentDidMount = async () => {
        const bets = await getAllBets()
        this.setState({bets})
    }

    toggleView = () => {
        this.setState({ visible: !this.state.visible })
        this.refs["plusButton"].setNativeProps({
            source: [this.state.visible ? resolveAssetSource(require("../assets/plus.png")) : resolveAssetSource(require("../assets/cancel.png"))]
        })
    }

    populatingCards = () => {
        const bets = this.state.bets
        let arr = [];
        console.log(bets)

        // if(bets.length){
        //     let arr = []
        //     for (let i = 0; i < bets.length; i++){
        //         let holder = ''
        //         for (let key in bets[i].obj){
        //             if(bets[i].obj.hasOwnProperty(key)){
        //                 holder = holder + (key + '=' + bets[i].obj[key] + '')
        //             }
        //         }
        //         arr.push(holder);
        //         holder = ''
        //     }
        //     return arr
        // }

        if(bets.length){
            let arr = []
            for (let i = 0; i < bets.length; i++){
                arr.push(<SwipeComp bet={bets[i].obj}/>)
            }
            return arr
        }

        // if(bets.length){
        //     for (let i = 0; i < bets.length; i++){
        //         arr.push(bets[i].obj)
        //     }
        //     console.log(bets, 'this is line 58')
        //     return arr
        // }
    }

    render() {
        if (this.state.bets.length){
            const arr = this.populatingCards()
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 / 3, backgroundColor: "#228B22" }}>

                        <WebView
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            source={{ uri: `http://player.twitch.tv/?channel=${this.props.navigation.state.params.login}` }}

                            style={{ marginTop: 0 }}
                        />
                    </View>
                    <View style={{ flex: 2 / 3 }}>
                        {/* insert card date here in cards prop */}
                        <Swiper cards={arr} />
                        {console.log('params', this.props.navigation.state.params)}
                        <SlideUpPanel visible={this.state.visible} allowDragging={this.state.allowDragging} id={this.props.navigation.state.params.id} props = {this.props.navigation.state.params} toggleView = {this.toggleView} />
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", right: 15, bottom: 15, position: "absolute" }}>
                            <TouchableOpacity onPress={this.toggleView}>
                                <Image ref="plusButton" style={{ width: 80, height: 80 }} source={require('../assets/plus.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        } else {
            return null
        }
    }
}
