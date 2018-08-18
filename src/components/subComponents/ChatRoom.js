import React, { Component } from "react"
import { Text, View, Image, TouchableOpacity, Alert, PixelRatio } from 'react-native';
import * as firebase from 'firebase'
import { addNewChat, listenForNewChats, retrieveUserInfo, retrieveAllChats } from "../../db/firebaseMethods"
import { GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat'
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
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }
    async componentDidMount() {
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
            arr.forEach(val => val.createdAt = val.createdAt.seconds * 1000)
            if (!arr.length) {
                arr.push({
                    _id: 1,
                    text: 'Chat is currently empty :( I need more friends!',
                    createdAt: new Date(),
                    system: true,
                    user: {
                        _id: 2,
                        name: "raven",
                        avatar: require("../../assets/raven.gif")
                    }
                })
            }
            this.setState({ messages: arr.sort(function (a, b) { return b.createdAt - a.createdAt }) })
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
    renderSend(props) {
        return (
            <Send
                {...props}
                style={{ flex: 1 }}
            >
                <View style={{ marginRight: 10, marginBottom: 10 }}>
                    <Image style={{ height: 25, width: 25 }} source={require("../../assets/send.png")} resizeMode={'center'} />
                </View>
            </Send>
        );
    }
    handleKeyDown(e) {
        console.log("send pressed")

    }
    renderInputToolbar(props) {
        //Add the extra styles via containerStyle
        return <InputToolbar {...props} textInputProps={{ returnKeyType: "send", multiline: false, onSubmitEditing: this.handleKeyDown }} />
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
                    placeholder={"Go ahead, say something!"}
                    renderSend={this.renderSend}
                    renderInputToolbar={this.renderInputToolbar}

                // listViewProps={keyboardShouldPersistTaps = "always"}

                />
            </View>
        )
    }
}


