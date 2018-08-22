import React, { Component } from 'react'
import Swiper from 'react-native-deck-swiper'
import { Button, StyleSheet, Text, View, Dimensions, Platform } from 'react-native'
import * as firebase from "firebase"
import { getAllBetsByStreamer, takeBet, getUserCurrentStreamer } from "../../db/firebaseMethods"


export default class TinderCards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: [{ name: "Alan" }],
            user: {},
            swipedAllCards: false,
            swipeDirection: '',
            isSwipingBack: false,
            cardIndex: 0,
            bets: []
        }
    }
    async componentDidMount() {
        let user = firebase.auth().currentUser
        const userId = user.uid
        const streamer = await getUserCurrentStreamer()
        const bets = await getAllBetsByStreamer(userId, streamer)
        this.setState({ cards: bets, user: user })
    }

    renderCard = (card, index) => {
        return (
            <View style={styles.card}>


                <Text style={styles.LeftC_Text_Style} >
                    {card.betAmount}
                </Text>

                <Text style={styles.LeftB_Text_Style} >
                    {card.betType === "Win" ? "on" : "against"}
                </Text>

                <Text style={styles.LeftC_Text_Style} >
                    {card.epicUser}
                </Text>
            </View>

        )
    };

    onSwipedAllCards = () => {
        this.setState({
            swipedAllCards: true
        })
    };

    swipeBack = () => {
        if (!this.state.isSwipingBack) {
            this.setIsSwipingBack(true, () => {
                this.swiper.swipeBack(() => {
                    this.setIsSwipingBack(false)
                })
            })
        }
    };

    setIsSwipingBack = (isSwipingBack, cb) => {
        this.setState(
            {
                isSwipingBack: isSwipingBack
            },
            cb
        )
    };

    swipeLeft = () => {
        this.swiper.swipeLeft()
    };
    onSwipedRight = () => {
        takeBet(this.state.cards[this.state.cardIndex], this.state.user.uid)
    }

    render() {
        return (
            <View style={styles.container}>
                <Swiper
                    ref={swiper => {
                        this.swiper = swiper
                    }}
                    onSwiped={this.onSwiped}
                    onSwipedRight={this.onSwipedRight}
                    cards={this.state.cards}
                    cardIndex={this.state.cardIndex}
                    cardVerticalMargin={80}
                    renderCard={this.renderCard}
                    onSwipedAll={this.onSwipedAllCards}
                    stackSize={3}
                    stackSeparation={15}
                    backgroundColor={"#FFF"}
                    disableTopSwipe={true}
                    disableBottomSwipe={true}
                    infinite={true}
                    overlayLabels={{
                        left: {
                            title: 'Pass',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: -30
                                }
                            }
                        },
                        right: {
                            title: 'Take Bet',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: 30
                                }
                            }
                        }
                    }}
                    animateOverlayLabelsOpacity
                    animateCardOpacity
                >
                </Swiper>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
    },
    card: {
        flex: 1,
        borderRadius: 15,
        borderWidth: 2,
        marginTop: 100,
        borderColor: "#E8E8E8",
        justifyContent: "center",
        backgroundColor: "grey",
        height: Dimensions.get("window").width,
        width: Dimensions.get("window").width * 0.75,
        alignItems: "center",

    },
    text: {
        textAlign: "center",
        fontSize: 50,
        backgroundColor: "transparent"
    },
    LeftB_Text_Style:
    {
        fontFamily: "SUPRRG",
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'transparent'
    },
    LeftC_Text_Style:
    {
        fontFamily: "SUPRRG",
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'transparent'
    },
});