import React, { Component } from "react"
import { GiftedForm, GiftedFormManager } from "react-native-gifted-form"
import moment from "moment"
import { updateUser } from "../../db/firebaseMethods"
import { Text, View, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';


import { styles } from "../index"
import * as firebase from "firebase"
import { TouchableWithoutFeedback, Keyboard } from 'react-native';


export default class UserSetupForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            loading: true
        }
        this.focusNextField = this.focusNextField.bind(this);
        // to store our input refs
        this.inputs = {};

    }
    focusNextField(key) {
        this.inputs[key].focus();
    }
    componentDidMount() {
        setTimeout(() => this.setState({ loading: false }), 1000)
    }

    render() {
        return this.state.loading ? (<View style={{ flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" }}>
            <Image style={{ width: 300, height: 300 }} source={require("../../assets/loading-1.gif")} />
        </View>) : (
                this.props.user &&
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <GiftedForm
                        scrollEnabled={false}

                        style={{
                            backgroundColor: "#FFF",
                        }
                        }
                        formName='signupForm' // GiftedForm instances that use the same name will also share the same states
                        openModal={() => { }}
                        clearOnClose={false} // delete the values of the form when unmounted
                        defaults={{
                            fullName: this.props.user.name,
                            username: this.props.user.username || "",
                            password: '',
                            // country: 'USA',
                            // birthday: new Date(((new Date()).getFullYear() - 18) + ''),
                            emailAddress: this.props.user.email
                        }}
                        validators={{
                            fullName: {
                                title: 'Full name',
                                validate: [{
                                    validator: 'isLength',
                                    arguments: [1, 23],
                                    message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                                }]
                            },
                            username: {
                                title: 'Username',
                                validate: [{
                                    validator: 'isLength',
                                    arguments: [3, 16],
                                    message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                                }, {
                                    validator: 'matches',
                                    arguments: /^[a-zA-Z0-9]*$/,
                                    message: '{TITLE} can contains only alphanumeric characters'
                                }]
                            },
                            password: {
                                title: 'Password',
                                validate: [{
                                    validator: 'isLength',
                                    arguments: [6, 16],
                                    message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                                }]
                            },
                            emailAddress: {
                                title: 'Email address',
                                validate: [{
                                    validator: 'isLength',
                                    arguments: [6, 255],
                                }, {
                                    validator: 'isEmail',
                                }]
                            },
                        }}
                    >
                        <GiftedForm.SeparatorWidget />
                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: "#ffff", padding: 15 }}>
                            <Image style={styles.avatar} source={{ uri: `${this.props.user.picture}` }} />
                        </View>
                        <GiftedForm.TextInputWidget
                            keyboardType="default"
                            returnKeyType="next"
                            name='fullName'
                            title='Full name'
                            autoFocus={this.props.user.username ? false : true}
                            blurOnSubmit={false}

                            image={require('../../assets/user.png')}
                            placeholder='Molly Bloom'
                            clearButtonMode='while-editing'
                            ref={input => {
                                this.inputs['one'] = input;
                            }}
                            onSubmitEditing={() => {
                                // specify the key of the ref, as done in the previous section.
                                this.focusNextField('two');
                            }}
                        />

                        <GiftedForm.TextInputWidget
                            returnKeyType="next"
                            name='username'
                            title='Username'
                            image={require('../../assets/username.png')}
                            placeholder='MollyBloom25'
                            clearButtonMode='while-editing'
                            onTextInputFocus={(currentText = '') => {
                                if (!currentText) {
                                    let fullName = GiftedFormManager.getValue('signupForm', 'fullName');
                                    if (fullName) {
                                        return fullName.replace(/[^a-zA-Z0-9-_]/g, '');
                                    }
                                }
                                return currentText;
                            }}
                            blurOnSubmit={false}
                            onSubmitEditing={() => {
                                this.focusNextField('three');
                            }}
                            ref={input => {
                                this.inputs['two'] = input;
                            }}
                        />

                        <GiftedForm.TextInputWidget
                            name='password' // mandatory
                            title='Password'
                            placeholder='******'
                            clearButtonMode='while-editing'
                            secureTextEntry={true}
                            returnKeyType="next"
                            image={require('../../assets/lock.png')}
                            blurOnSubmit={false}
                            onSubmitEditing={() => {
                                this.focusNextField('four');
                            }}
                            ref={input => {
                                this.inputs['three'] = input;
                            }}
                        />

                        <GiftedForm.TextInputWidget
                            name='emailAddress' // mandatory
                            title='Email address'
                            placeholder='molly@gmail.com'
                            keyboardType='email-address'
                            returnKeyType="done"
                            clearButtonMode='while-editing'
                            image={require('../../assets/email.png')}
                            blurOnSubmit={true}
                            ref={input => {
                                this.inputs['four'] = input;
                            }}
                        />
                        <GiftedForm.SeparatorWidget />

                        <GiftedForm.ErrorsWidget />
                        <GiftedForm.SubmitWidget
                            title={this.props.user.username ? 'Submit Changes' : "Sign up"}
                            widgetStyles={{
                                submitButton: {
                                    backgroundColor: "#00aa9e",
                                    marginTop: 10,
                                    borderRadius: 10,
                                    width: Dimensions.get("window").width - 64,
                                    height: 50,
                                    alignSelf: "center"
                                },
                                textSubmitButton: {
                                    color: 'white', fontWeight: '800', fontSize: 18
                                }
                            }}
                            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                                if (isValid === true) {
                                    // prepare object
                                    values.birthday = moment(values.birthday).format('YYYY-MM-DD');
                                    updateUser({
                                        "id": `${this.props.user.id}`,
                                        "email": `${values.emailAddress}`,
                                        "name": `${values.fullName}`,
                                        "picture": `${this.props.user.picture}`,
                                        "username": values.username,
                                        "exists": true,
                                        "loggedIn": true,
                                        "balance": this.props.user.balance,
                                        // "password": values.password
                                    })
                                    setTimeout(() => postSubmit(), 1000);
                                    if (!this.props.user.username) {
                                        this.props.navigateToAllStreams()
                                    } else {
                                        setTimeout(() => Alert.alert(
                                            'Changes Saved!',
                                            'Press OK to dismiss',
                                            [
                                                { text: 'OK', onPress: () => values = {} },
                                            ],
                                            { cancelable: false }
                                        ), 1000)

                                    }



                                    /* Implement the request to your server using values variable
                                    ** then you can do:
                                    ** postSubmit(); // disable the loader
                                    ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
                                    ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
                                    ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
                                    */
                                }
                            }}
                        />

                        <GiftedForm.NoticeWidget
                            title={this.props.user.username ? "" : 'By signing up, you agree to the Terms of Service and Privacy Policity.'}
                            style={{ color: "black", fontFamily: "MPR" }}
                        />
                        <GiftedForm.HiddenWidget name='tos' value={true} />
                    </GiftedForm >
                </TouchableWithoutFeedback>

            );
    }
}