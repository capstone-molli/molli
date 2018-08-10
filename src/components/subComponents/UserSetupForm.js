import React, { Component } from "react"
import { GiftedForm, GiftedFormManager } from "react-native-gifted-form"
import moment from "moment"
import { updateUser } from "../../db/firebaseMethods"
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from "../index"

export default class UserSetupForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
    }
    componentDidMount() {
        this.setState({ user: this.props.user })
    }
    render() {
        return (
            this.props.user &&
            <GiftedForm
                formName='signupForm' // GiftedForm instances that use the same name will also share the same states
                openModal={() => { }}
                clearOnClose={false} // delete the values of the form when unmounted
                defaults={{
                    fullName: this.props.user.name,
                    username: `${this.props.user.first_name}${this.props.user.last_name}`,
                    password: '',
                    country: 'USA',
                    birthday: new Date(((new Date()).getFullYear() - 18) + ''),
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


                    birthday: {
                        title: 'Birthday',
                        validate: [{
                            validator: 'isBefore',
                            arguments: [moment().utc().subtract(18, 'years').format('YYYY-MM-DD')],
                            message: 'You must be at least 18 years old'
                        }, {
                            validator: 'isAfter',
                            arguments: [moment().utc().subtract(100, 'years').format('YYYY-MM-DD')],
                            message: '{TITLE} is not valid'
                        }]
                    },
                    country: {
                        title: 'Country',
                        validate: [{
                            validator: 'isLength',
                            arguments: [2],
                            message: '{TITLE} is required'
                        }]
                    },
                }}
            >
                <GiftedForm.SeparatorWidget />
                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: "#ffff", top: 10 }}>
                    <Image style={styles.avatar} source={{ uri: `${this.props.user.picture.data.url}` }} />
                </View>
                <GiftedForm.TextInputWidget
                    name='fullName' // mandatory
                    title='Full name'
                    // image={require('../../assets/icons/color/user.png')}
                    placeholder='Molly Bloom'
                    clearButtonMode='while-editing'
                />

                <GiftedForm.TextInputWidget
                    name='username'
                    title='Username'
                    // image={require('../../assets/icons/color/contact_card.png')}
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
                />

                <GiftedForm.TextInputWidget
                    name='password' // mandatory
                    title='Password'
                    placeholder='******'
                    clearButtonMode='while-editing'
                    secureTextEntry={true}
                // image={require('../../assets/icons/color/lock.png')}
                />

                <GiftedForm.TextInputWidget
                    name='emailAddress' // mandatory
                    title='Email address'
                    placeholder='molly@gmail.com'
                    keyboardType='email-address'
                    clearButtonMode='while-editing'
                // image={require('../../assets/icons/color/email.png')}
                />

                <GiftedForm.SeparatorWidget />



                <GiftedForm.ModalWidget
                    title='Birthday'
                    displayValue='birthday'
                    // image={require('../../assets/icons/color/birthday.png')}
                    scrollEnabled={false}
                >
                    <GiftedForm.SeparatorWidget />

                    <GiftedForm.DatePickerIOSWidget
                        name='birthday'
                        mode='date'
                        getDefaultDate={() => {
                            return new Date(((new Date()).getFullYear() - 18) + '');
                        }}
                    />
                </GiftedForm.ModalWidget>

                <GiftedForm.ModalWidget
                    title='Country'
                    displayValue='country'
                    // image={require('../../assets/icons/color/passport.png')}
                    scrollEnabled={false}
                >
                    <GiftedForm.SelectCountryWidget
                        code='alpha2'
                        name='country'
                        title='Country'
                        autoFocus={true}
                    />
                </GiftedForm.ModalWidget>
                <GiftedForm.ErrorsWidget />
                <GiftedForm.SubmitWidget
                    title='Sign up'
                    widgetStyles={{
                        submitButton: {
                            // backgroundColor: themes.mainColor,
                        }
                    }}
                    onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                        if (isValid === true) {
                            // prepare object
                            values.birthday = moment(values.birthday).format('YYYY-MM-DD');
                            console.log("values: ", values)
                            console.log("unedited user", this.state.user)
                            updateUser(this.props.user.id, {
                                "email": `${values.emailAddress}`,
                                "first_name": this.props.user.first_name,
                                "id": this.props.user.id,
                                "last_name": this.props.user.last_name,
                                "name": `${values.fullName}`,
                                "picture": this.props.user.picture
                            })
                            this.props.navigateToAllStreams()
                            postSubmit()

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
                    title='By signing up, you agree to the Terms of Service and Privacy Policity.'
                />
                <GiftedForm.HiddenWidget name='tos' value={true} />
            </GiftedForm >
        );
    }
}