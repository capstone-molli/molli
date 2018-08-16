import React, { Component } from 'react'
import { Platform, StyleSheet, View, Text, Dimensions, Animated, PanResponder, Image } from 'react-native';

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
                bounciness: 5,
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
    console.log(this.props.item, 'line 148')
    const rotateCard = this.state.Xposition.interpolate(
      {
        inputRange: [-200, 0, 200],
        outputRange: ['-20deg', '0deg', '20deg'],
      });
    return (

      <Animated.View {...this.panResponder.panHandlers}
        style={[
          styles.cardView_Style, {
            backgroundColor: '#8b9dc3',
            opacity: this.CardView_Opacity,
            transform: [{ translateX: this.state.Xposition },
            { rotate: rotateCard }]
          }
        ]}>

        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 / 3, flexDirection: "row" }}>
            <Text style={styles.CardView_Title} >
              {this.props.item.epicUser} predicts a {<Image style={{ width: 50, height: 50 }} source={this.props.item.betType === "Win" ? require("../assets/win.png") : require("../assets/lose.png")} />}
            </Text>
          </View>

          <Text style={styles.CardView_Title} >
            ${this.props.item.betAmount} on the table.
            </Text>
        </View>
        {

          (this.state.LeftText) ? (<Text style={styles.Left_Text_Style}> Pass </Text>) : null

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
    console.log(this.props.cards, 'pan viewer')
    if (this.props.cards.length) {
      console.log('truthy')
      return (
        <View style={styles.MainContainer}>
          {
            this.props.cards.map((item, key) => (
              // console.log(item, 'this is being mapped')
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
      borderRadius: 15,
      margin: 10,
      marginTop: 100,
      marginBottom: 100,
      borderWidth: 1,
      borderColor: '#FFF',
      backgroundColor: '#8b9dc3'
    },

    CardView_Title:
    {
      color: '#FFF',
      fontSize: 24,
      backgroundColor: 'transparent'
    },

    Left_Text_Style:
    {
      top: 22,
      right: 32,
      position: 'absolute',
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: 'transparent'
    },

    Right_Text_Style:
    {
      top: 22,
      left: 32,
      position: 'absolute',
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: 'transparent'
    }
  });
