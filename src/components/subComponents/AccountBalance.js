import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'native-base'
import * as firebase from "firebase"
import { getUser, updateUserCredits, chargeUser } from "../../db/firebaseMethods"
import PaymentPopup from "./PaymentPopup"
import { LiteCreditCardInput } from "react-native-credit-card-input";
import AddCreditsForm from "./AddCreditsForm"
var stripe = require("stripe-client")("sk_test_4o5DHY7OSc9FDGaStd5DRKA2");

class AccountBalance extends Component {
    constructor() {
        super();
        this.state = {
            user: {},
            userId: '',
            visible: false,
            number: "",
            cvc: "",
            expiry: "",
            type: "",
            credit: ""
        }
        this._openPopUp = this._openPopUp.bind(this)
        this._closePopUp = this._closePopUp.bind(this)
        this._onChange = this._onChange.bind(this)
        this._onFocus = this._onFocus.bind(this)
        this.addCredit = this.addCredit.bind(this)
    };

    async componentDidMount() {
        var user = firebase.auth().currentUser
        const userId = user.uid
        const newUser = await getUser(userId)
        this.setState({
            user: newUser,
            userId,
            isPaying: false
        })
        console.log("user:", newUser)
    }
    addCredit(credit) {
        this._closePopUp()
        this.setState({ credit, isPaying: true })
        this._openPopUp()


    }

    _onChange = async (formData) => {
        if (formData.status.number === "valid") {
            this.setState({ number: await formData.values.number })
            console.log("state", this.state.number)
            formData.values.number = ""
        } else if (formData.status.cvc === "valid" && formData.status.cvc === "valid") {
            const [exp_month, exp_year] = await formData.values.expiry.split("/")
            const cvc = await formData.values.cvc
            const obj = { "card": { "cvc": cvc, "number": this.state.number, "exp_month": Number(exp_month), "exp_year": Number(exp_year) } }
            console.log("obj:", obj)
            const card = await stripe.createToken(obj)
            console.log("Card info", card)
            const charge = await chargeUser(card, Number(this.state.credit.slice(1)))
            if (charge.body.charge.failure_code === null) {
                updateUserCredits(this.state.userId, this.state.credit)
            }
            console.log("charge", charge)
            this.setState({ isPaying: false })
            //send card to backend for processing



            //clear trace of credit card info 
            this.setState({ number: "", credit: "" })
            formData.values.cvc = ""
            formData.values.expiry = ""
            this._closePopUp()
        }
    }
    _onFocus = (field) => console.log("focusing", field);

    submit = () => {
        const formValues = this.formGenerator.getValues();
        if (formValues.Credits === "???") return
        Alert.alert(
            'Credits Added',
            'Press OK to dismiss',
            [
                { text: 'OK', onPress: () => values = {} },
            ],
            { cancelable: false }
        )
    }
    _openPopUp() {
        this.setState({
            isVisible: true
        });
    }

    _closePopUp() {
        this.setState({
            isVisible: false
        });
    }

    validate(field) {
        let error = false;
        let errorMsg = '';
        if (field.name === 'Credits' && (field.value === "???")) {
            error = true;
            errorMsg = 'select an amount';
        }
        return { error, errorMsg }
    }

    render() {
        const popupContent = !this.state.isPaying ? <AddCreditsForm addCredit={this.addCredit} /> : <LiteCreditCardInput
            autoFocus
            inputStyle={{
                fontSize: 16,
                color: "black",
            }}
            validColor={"black"}
            invalidColor={"red"}
            placeholderColor={"darkgray"}
            onChange={this._onChange}
        />
        return (
            <View style={{ flex: 1, backgroundColor: "#FFF" }}>
                <View style={{ flex: 1, backgroundColor: "#FFF", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        <Image style={{ width: 25, height: 25 }} source={require("../../assets/blueBill.png")} />
                        <Text style={{ fontSize: 20 }}>Balance: ${this.state.user.balance}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this._openPopUp} style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        <Image style={{ width: 25, height: 25 }} source={require("../../assets/handDollar.png")} />
                        <Text style={{ fontSize: 20 }}>Add Credits</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        <Image style={{ width: 25, height: 25 }} source={require("../../assets/handDollar.png")} />
                        <Text style={{ fontSize: 20 }}>Donate To Streamer</Text>
                    </TouchableOpacity>

                </View>
                <PaymentPopup isVisible={this.state.isVisible} duration={600} entry={'bottom'} exit={'bottom'}>
                    {popupContent}
                    <Text style={{ textAlign: 'center', alignItems: "center" }} onPress={() => this._closePopUp()} buttonType='primary'>Cancel</Text>
                </PaymentPopup>
            </View>

        )
    }
}

export default AccountBalance
