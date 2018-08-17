import React, { Component } from "react"
import { GiftedForm, GiftedFormManager } from "react-native-gifted-form"
import moment from "moment"
import { createNewBet } from "../../db/firebaseMethods"
import { Text, View, Image, TouchableOpacity, Alert, PixelRatio } from 'react-native';
import { styles } from "../index"
import SlidingUpPanel from 'rn-sliding-up-panel'
import * as firebase from 'firebase'
import GenerateForm from 'react-native-form-builder';
import NewBetForm from "../subComponents/NewBetForm"


export default class BetForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            epicUser: this.props.props.display,
            description: '0',
            betAmount: '',
        }
        this.handleChange = this.handleChange.bind(this)
    }
    componentDidMount() {
        this.setState({ user: firebase.auth().currentUser.uid })
    }

    handleChange(value) {
        this.setState({ value })
    }


    render() {
        return (
            <SlidingUpPanel visible={this.props.visible}
                allowDragging={this.props.allowDragging}
                showBackdrop={true}
                draggableRange={{ top: 750, bottom: 0 }}
                onRequestClose={this.props.contract}
                style={{ backgroundColor: "#FFF" }}>
                <View style={{ flex: 1, backgroundColor: "#FFF", borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
                    <NewBetForm user={this.state.user} epicUser={this.props.props.display} toggleView={this.props.toggleView} />
                </View>
            </SlidingUpPanel>
        );
    }
}