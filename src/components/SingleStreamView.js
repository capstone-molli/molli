import React, { Component } from 'react';
import { View, Image, TouchableOpacity, WebView } from 'react-native';
import Swiper from "./subComponents/SwiperComponent"
import SlideUpPanel from "./subComponents/SlideUpPanel"
import resolveAssetSource from 'resolveAssetSource';
import { getBet, getAllBets } from '../db/firebaseMethods'
import MyApp from './PanView'
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
    goBack = () => {
        const { navigate } = this.props.navigation
        navigate("AllStreamView")
    }

    componentDidMount = async () => {
        const bets = await getAllBets()
        this.setState({ bets })
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

        if (bets.length) {
            let arr = []
            for (let i = 0; i < bets.length; i++) {
                arr.push(bets[i].obj)
            }
            console.log(arr, 'this is the arr that we will pass in')
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
        const cardInfo = this.populatingCards()
        if (this.state.bets.length) {
            const arr = this.populatingCards()
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 5 / 12, backgroundColor: "#228B22" }}>
                        <View style={{ flex: 2 / 10, flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-end" }}>
                            <TouchableOpacity onPress={this.goBack}>
                                <Image style={{ width: 30, height: 30, bottom: 20 }} source={require("../assets/back.png")} />
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
                        //insert card date here in cards prop
                        {/* <Swiper cards={['do', 'more']}/> */}
                        <MyApp cards={cardInfo} />
                        <SlideUpPanel visible={this.state.visible} allowDragging={this.state.allowDragging} props={this.props.navigation.state.params} toggleView={this.toggleView} />
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
