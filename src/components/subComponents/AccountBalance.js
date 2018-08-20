import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import {Button} from 'native-base'
import * as firebase from "firebase"
import { getUser, updateUserCredits } from "../../db/firebaseMethods"
import GenerateForm from 'react-native-form-builder';


const styles = {
    wrapper: {
        flex: 1,
        // marginTop: 200,
        justifyContent: "flex-end",
        marginBottom: 450
    },
    submitButton: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
};

const fields = [
    {
        type: 'picker',
        name: 'Credits',
        mode: 'dropdown',
        label: 'How many credits would you like to add?',
        defaultValue: '???',
        options: [
            "???",
            '$0',
            '$1',
            '$2',
            '$3',
            '$4',
            '$5',
            '$6',
            '$7',
            '$8',
            '$9',
            '$10',
            '$11',
            '$12',
            '$13',
            '$14',
            '$15',
            '$16',
            '$17',
            '$18',
            '$19',
            '$20',
            '$21',
            '$22',
            '$23',
            '$24',
            '$25',
            '$26',
            '$27',
            '$28',
            '$29',
            '$30',
            '$31',
            '$32',
            '$33',
            '$34',
            '$35',
            '$36',
            '$37',
            '$38',
            '$39',
            '$40',
            '$41',
            '$42',
            '$43',
            '$44',
            '$45',
            '$46',
            '$47',
            '$48',
            '$49',
            '$50',
            '$51',
            '$52',
            '$53',
            '$54',
            '$55',
            '$56',
            '$57',
            '$58',
            '$59',
            '$60',
            '$61',
            '$62',
            '$63',
            '$64',
            '$65',
            '$66',
            '$67',
            '$68',
            '$69',
            '$70',
            '$71',
            '$72',
            '$73',
            '$74',
            '$75',
            '$76',
            '$77',
            '$78',
            '$79',
            '$80',
            '$81',
            '$82',
            '$83',
            '$84',
            '$85',
            '$86',
            '$87',
            '$88',
            '$89',
            '$90',
            '$91',
            '$92',
            '$93',
            '$94',
            '$95',
            '$96',
            '$97',
            '$98',
            '$99'],
        props: { mode: "dropdown" }
    }
]

class AccountBalance extends Component {
    constructor(){
        super();
        this.state = {
            user: {},
            userId: ''
        }
    };

    async componentDidMount() {
        var user = firebase.auth().currentUser
        const userId = user.uid
        const newUser = await getUser(userId)
        this.setState({ 
            user: newUser,
            userId
        })
        console.log("user:", newUser)
    }

    submit = () => {
        const formValues = this.formGenerator.getValues();
        if (formValues.Credits === "???") return
            updateUserCredits(this.state.userId, formValues.Credits)
        Alert.alert(
            'Credits Added',
            'Press OK to dismiss',
            [
                { text: 'OK', onPress: () => values = {} },
            ],
            { cancelable: false }
        )
    }

    validate(field){
        let error = false;
        let errorMsg = '';
        if (field.name === 'Credits' && (field.value === "???")) {
            error = true;
            errorMsg = 'select an amount';
        }
        return {error, errorMsg}
    }

    render(){
        return (
            <View>
                <View>
                    <TouchableOpacity style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                            <Image style={{ width: 25, height: 25 }} source={require("../../assets/blueBill.png")} />
                            <Text style={{ fontSize: 20 }}>Balance: ${this.state.user.balance}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View>
                                <GenerateForm
                                    ref={(c) => {
                                        this.formGenerator = c;
                                    }}
                                    fields={fields}
                                    scrollViewProps={{ scrollEnabled: false, bounces: false }}
                                    customValidation={this.validate}

                                />
                            </View>
                            <View style={styles.submitButton}>
                                <Button block onPress={() => this.submit()} style={{ backgroundColor: "#00aa9e" }}>
                                    <Text style={{ color: 'white', fontWeight: '800', fontSize: 18 }}>Submit Bet</Text>;
                                </Button>
                            </View>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity style={{ borderBottomColor: "#000000", borderWidth: 2, borderColor: "#fff", padding: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                <Image style={{ width: 25, height: 25 }} source={require("../../assets/handDollar.png")} />
                                <Text style={{ fontSize: 20 }}>Donate To Streamer</Text>
                            </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default AccountBalance
