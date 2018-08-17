import React, { Component } from 'react'
import { Platform, StyleSheet, View, Text, Dimensions, Animated, PanResponder } from 'react-native';
import * as firebase from 'firebase';
import { takeBet } from '../db/firebaseMethods'

const SCREEN_WIDTH = Dimensions.get('window').width;

class SwipeableCardView extends Component {
  constructor() {
    super();

    this.panResponder;

    this.state = {

      Xposition: new Animated.Value(0),

      RightText: false,

      LeftText: false,

    }

    this.CardView_Opacity = new Animated.Value(1);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create(
      {
        onStartShouldSetPanResponder: (evt, gestureState) => false,

        onMoveShouldSetPanResponder: (evt, gestureState) => true,

        onStartShouldSetPanResponderCapture: (evt, gestureState) => false,

        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onPanResponderMove: (evt, gestureState) => {
          this.state.Xposition.setValue(gestureState.dx);

          if (gestureState.dx > SCREEN_WIDTH - 250) {
            let user = firebase.auth().currentUser
            const userId = user.uid
            takeBet(this.props.item, userId)

            this.setState({

              RightText: true,

              LeftText: false
            });

          }
          else if (gestureState.dx < -SCREEN_WIDTH + 250) {

            this.setState({

              LeftText: true,

              RightText: false

            });

          }
        },

        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx < SCREEN_WIDTH - 150 && gestureState.dx > -SCREEN_WIDTH + 150) {

            this.setState({

              LeftText: false,

              RightText: false

            });

            Animated.spring(this.state.Xposition,
              {
                toValue: 0,
                speed: 5,
                bounciness: 10,
              }, { useNativeDriver: true }).start();
          }

          else if (gestureState.dx > SCREEN_WIDTH - 150) {

            Animated.parallel(
              [
                Animated.timing(this.state.Xposition,
                  {
                    toValue: SCREEN_WIDTH,
                    duration: 200
                  }),

                Animated.timing(this.CardView_Opacity,
                  {
                    toValue: 0,
                    duration: 200
                  })
              ], { useNativeDriver: true }).start(() => {
                this.setState({ LeftText: false, RightText: false }, () => {
                  this.props.removeCardView();
                });
              });

          }
          else if (gestureState.dx < -SCREEN_WIDTH + 150) {
            Animated.parallel(
              [
                Animated.timing(this.state.Xposition,
                  {
                    toValue: -SCREEN_WIDTH,
                    duration: 200
                  }),

                Animated.timing(this.CardView_Opacity,
                  {
                    toValue: 0,
                    duration: 200
                  })
              ], { useNativeDriver: true }).start(() => {
                this.setState({ LeftText: false, RightText: false }, () => {
                  this.props.removeCardView();
                });
              });
          }
        }
      });
  }

  render() {
    const rotateCard = this.state.Xposition.interpolate(
      {
        inputRange: [-200, 0, 200],
        outputRange: ['-20deg', '0deg', '20deg'],
      });
    return (

      <Animated.View {...this.panResponder.panHandlers}
        style={[
          styles.cardView_Style, {
            backgroundColor: 'lightgrey',
            borderRadius: 15,
            opacity: this.CardView_Opacity,
            transform: [{ translateX: this.state.Xposition },
            { rotate: rotateCard }]
          }
        ]}>

        <Text style={styles.LeftC_Text_Style} >
          {this.props.item.betAmount}
        </Text>

        <Text style={styles.LeftB_Text_Style} >
          {this.props.item.betType === "Win" ? "on" : "against"}
        </Text>

        <Text style={styles.LeftC_Text_Style} >
          {this.props.item.epicUser}
          {/* Description: {this.props.item.description}
          Username: {this.props.item.epicUser} */}
        </Text>

        {

          (this.state.LeftText) ? (<Text style={styles.Left_Text_Style}> Pass on Bet </Text>) : null

        }

        {

          (this.state.RightText) ? (<Text style={styles.Right_Text_Style}> Bet Against </Text>) : null

        }

      </Animated.View>
    );
  }
}

export default class MyApp extends Component {
  constructor() {
    super();

    this.state = {
      Sample_CardView_Items_Array:
        [
          {
            id: '1',
            cardView_Title: 'CardView 1',
            backgroundColor: '#4CAF50'
          },

          {
            id: '2',
            cardView_Title: 'CardView 2',
            backgroundColor: '#607D8B'
          },

          {
            id: '3',
            cardView_Title: 'CardView 3',
            backgroundColor: '#9C27B0'
          },

          {
            id: '4',
            cardView_Title: 'CardView 4',
            backgroundColor: '#00BCD4'
          },

          {
            id: '5',
            cardView_Title: 'CardView 5',
            backgroundColor: '#FFC107'
          },

        ], No_More_CardView: false
    };
  }

  componentDidMount() {
    this.setState({ Sample_CardView_Items_Array: this.state.Sample_CardView_Items_Array.reverse() });

    if (this.state.Sample_CardView_Items_Array.length == 0) {
      this.setState({ No_More_CardView: true });
    }
  }

  removeCardView = (id) => {
    this.state.Sample_CardView_Items_Array.splice(this.state.Sample_CardView_Items_Array.findIndex(x => x.id == id), 1);

    this.setState({ Sample_CardView_Items_Array: this.state.Sample_CardView_Items_Array }, () => {
      if (this.state.Sample_CardView_Items_Array.length == 0) {
        this.setState({ No_More_CardView: true });
      }
    });
  }

  render() {
    if (this.props.cards.length) {
      return (
        <View style={styles.MainContainer}>
          {
            this.props.cards.map((item, key) => (
              <SwipeableCardView key={key} item={item} removeCardView={this.removeCardView.bind(this, item.id)} />
            ))
          }
        </View>
      );
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create(
  {
    MainContainer:
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },

    cardView_Style:
    {
      width: '75%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      borderRadius: 2,
      margin: 10,
      marginTop: 100,
      marginBottom: 100,
      borderWidth: 1,
      borderColor: 'lightgrey',
      backgroundColor: 'blue'
    },

    CardView_Title:
    {
      color: 'black',
      fontSize: 24,
      backgroundColor: 'transparent',
      // fontFamily: "SUPRRG"
    },

    Left_Text_Style:
    {
      fontFamily: "SUPRRG",
      top: 22,
      right: 32,
      position: 'absolute',
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: 'transparent'
    },
    LeftB_Text_Style:
    {
      fontFamily: "SUPRRG",
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: 'transparent'
    },
    LeftC_Text_Style:
    {
      fontFamily: "SUPRRG",
      color: '#FFF',
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: 'transparent'
    },

    Right_Text_Style:
    {
      fontFamily: "SUPRRG",
      top: 22,
      left: 32,
      position: 'absolute',
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: 'transparent'
    }
  });
