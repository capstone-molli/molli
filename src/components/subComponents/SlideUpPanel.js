import React, { Component } from "react"
import { GiftedForm, GiftedFormManager } from "react-native-gifted-form"
import moment from "moment"
import { createNewBet } from "../../db/firebaseMethods"
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from "../index"
import SlidingUpPanel from 'rn-sliding-up-panel'

export default class BetForm extends Component {
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
            <SlidingUpPanel visible={this.props.visible}
            allowDragging={this.props.allowDragging}
            showBackdrop={true}
            draggableRange={{ top: 750, bottom: 0 }}
            onRequestClose={this.props.contract}>

                <GiftedForm style = {{flex: 1}}
                    formName='betForm' // GiftedForm instances that use the same name will also share the same states
                    openModal={() => { }}
                    clearOnClose={false} // delete the values of the form when unmounted
                    defaults={{
                        betType: '',
                        description: {},
                        userId: '',
                        epicUser: ''
                        
                    }}
                >
                    <GiftedForm.SeparatorWidget />
                    
                        <GiftedForm.SelectWidget name='betType' title='Bet Type' multiple={false}>
                            <GiftedForm.OptionWidget  name='Win' title='Win' value='Win'/>
                            <GiftedForm.OptionWidget  name='Loss' title='Loss' value='Loss'/>
                            <GiftedForm.OptionWidget  name='Kills' title='Kill Total' value='Kills'/>
                        </GiftedForm.SelectWidget>

                    <GiftedForm.TextInputWidget
                        name='epicUsername'
                        title='Epic Username'
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
                        name='betAmount'
                        title='Bet Amount'
                        // image={require('../../assets/icons/color/contact_card.png')}
                        placeholder='1'
                        clearButtonMode='while-editing'
                    />

                    

                    <GiftedForm.SeparatorWidget />
                    <GiftedForm.ErrorsWidget />
                    <GiftedForm.SubmitWidget
                        title='Next'
                        widgetStyles={{
                            submitButton: {
                                // backgroundColor: themes.mainColor,
                            }
                        }}
                        onSubmit={(isValid, values, postSubmit = null) => {
                            // if (values.betType === 'Kills')
                            if (isValid === true) {
                                // prepare object
                                console.log("values: ", values)
                                createNewBet({
                                    'betType': `${values.betType}`,
                                    "userId": `${this.props.id}`,
                                    "epicUser": `${values.epicUsername}`,
                                    "description": `${values.description}`,
                                    'betAmount': `${values.amount}`
                                })
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
                        title='This is for educational purposes only.'
                    />
                    <GiftedForm.HiddenWidget name='tos' value={true} />
                </GiftedForm >
            </SlidingUpPanel>
        );
    }
}