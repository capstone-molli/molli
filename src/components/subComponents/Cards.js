import React, { Component } from "react"
import MyApp from '../PanView'
import { getBet, getAllBets } from '../../db/firebaseMethods'


export default class Cards extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            allowDragging: true,
            bets: []
        }
    }
    populatingCards = () => {
        const bets = this.state.bets
        let arr = [];
        console.log(bets)

        if (bets.length) {
            let arr = []
            for (let i = 0; i < bets.length; i++) {
                arr.push(bets[i].obj)
            }
            console.log(arr, 'this is the arr that we will pass in')
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