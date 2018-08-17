import React, { Component } from "react"
import { Text, View, Image, TouchableOpacity, Alert, PixelRatio } from 'react-native';
import * as firebase from 'firebase'
import { addNewChat, listenForNewChats, retrieveUserInfo, retrieveAllChats } from "../../db/firebaseMethods"
import { GiftedChat } from 'react-native-gifted-chat'
import emojiUtils from 'emoji-utils';
import SlackMessage from "./CustomChat"
import firestore from "../../db/firebase"



export default class ChatRoom extends React.Component {
    constructor() {
        super()
        this.state = {
            messages: [],
            user: {}
        }
        this.listen = this.listen.bind(this)
    }
    async componentWillMount() {
        const user = await retrieveUserInfo()
        this.listen()
        this.setState({
            user: user
        })
    }
    async listen() {
        await firestore.collection('chatRoom').onSnapshot(snap => {
            let arr = []
            snap.forEach((s) => arr.push(s.data()))
            this.setState({ messages: arr.sort(function (a, b) { return b.createdAt.seconds - a.createdAt.seconds }) })
            console.log("data", arr)
        })
    }
    onSend(messages = []) {
        addNewChat(messages[messages.length - 1])
    }
    renderMessage(props) {
        const { currentMessage: { text: currText } } = props;
        let messageTextStyle;
        if (currText && emojiUtils.isPureEmojiString(currText)) {
            messageTextStyle = {
                fontSize: 28,
                lineHeight: Platform.OS === 'android' ? 34 : 30,
            };
        }
        return (
            <SlackMessage {...props} messageTextStyle={messageTextStyle} />
        );
    }

    render() {
        return this.state.user != {} && (
            <View style={{ backgroundColor: "#FFF", flex: 1 }}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.user.id,
                        name: this.state.user.username,
                        avatar: this.state.user.picture,
                    }}
                    renderMessage={this.renderMessage}
                    isAnimated={true}
                    showAvatarForEveryMessage={true}
                    placeholder={"Go ahead, say something :)"}
                />
            </View>
        )
    }
}