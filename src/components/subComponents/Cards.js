import React, { Component } from "react"
import MyApp from '../PanView'
import { getAllBets, retrieveUserInfo } from '../../db/firebaseMethods'
import * as firebase from 'firebase';



export default class Cards extends Component {
    constructor() {
        super()
        this.state = {
            bets: []
        }
    }
    populatingCards = () => {
        const bets = this.state.bets
        let arr = [];

        if (bets.length) {
            let arr = []
            for (let i = 0; i < bets.length; i++) {
                arr.push(bets[i])
            }
            return arr
        }
    }
    async componentDidMount() {
        let user = firebase.auth().currentUser
        const userId = user.uid
        const bets = await getAllBets(userId)
        this.setState({ bets })
        this.populatingCards()
    }
    render() {
        const cardInfo = this.populatingCards()
        return cardInfo ? (
            <MyApp cards={cardInfo} />
        ) : null
    }
}

