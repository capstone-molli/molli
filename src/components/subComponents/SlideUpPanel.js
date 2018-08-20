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
            epicUser: this.props.props.login,
            description: '0',
            betAmount: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.submit = this.submit.bind(this)
    }
    componentDidMount() {
        this.setState({ user: firebase.auth().currentUser.uid })
    }

    handleChange(value) {
        this.setState({ value })
    }
    submit() {
        this.props.viewDown()
    }


    render() {
        return (
            <SlidingUpPanel visible={this.props.visible}
                allowDragging={this.props.allowDragging}
                showBackdrop={true}
                draggableRange={{ top: 750, bottom: 0 }}
                onRequestClose={this.props.contract}
                style={{ backgroundColor: "#FFF", zIndex: 2 }}>
                <View style={{ flex: 1, backgroundColor: "#FFF", borderTopLeftRadius: 15, borderTopRightRadius: 15, justifyContent: "center" }}>
                    <TouchableOpacity onPress={this.submit}>
                        <Image source={require("../../assets/down.png")} style={{ top: 3, alignSelf: "center", width: 50, height: 50 }} />
                    </TouchableOpacity>
                    <NewBetForm user={this.state.user} epicUser={this.props.props.login} toggleView={this.props.viewDown} />
                </View>
            </SlidingUpPanel>
        );
    }
}