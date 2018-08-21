import React, { Component } from 'react';
import { View, Text, Button } from 'native-base';
import GenerateForm from 'react-native-form-builder';
import { createNewBet } from "../../db/firebaseMethods"
import { Alert } from "react-native"


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
        name: 'BetType',
        mode: 'dropdown',
        label: 'The streamer is going to...',
        defaultValue: '???',
        options: ['???', 'Win', 'Lose'],
        props: { mode: "dropdown" }
    },
    {
        type: 'picker',
        name: 'BetValue',
        mode: 'dropdown',
        label: 'How much do you wanna bet?',
        defaultValue: "???",
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
            '$99']
    },
]
export default class NewBetForm extends Component {
    submit() {
        const formValues = this.formGenerator.getValues();
        if (formValues.BetType === "???" || formValues.BetValue === "???") return
        createNewBet({
            'betType': `${formValues.BetType}`,
            "userId": `${this.props.user}`,
            "epicUser": `${this.props.epicUser}`,
            "description": `loss`,
            'betAmount': `${formValues.BetValue}`,
            'takerId': '',
            'timeOfCreation': new Date(),
            'timeOfMatch': '',
            'timeOfCompletion': '',
            'winnerId': null,
            'loserId': null
        })
        Alert.alert(
            'Bet Created!',
            'Press OK to dismiss',
            [
                { text: 'OK', onPress: () => values = {} },
            ],
            { cancelable: false }
        )
        this.props.toggleView()
    }
    validate(field) {
        let error = false;
        let errorMsg = '';
        if (field.name === 'BetType' && (field.value === "???")) {
            error = true;
            errorMsg = 'select a bet type';
        }
        if (field.name === 'BetValue' && (field.value === "???")) {
            error = true;
            errorMsg = 'select a bet amount';
        }
        return { error, errorMsg };
    }

    render() {
        return (
            <View style={styles.wrapper}>
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
            </View>
        );
    }
}