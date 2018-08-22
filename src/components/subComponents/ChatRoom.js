import React, { Component } from "react"
import { Text, View, Image, TouchableOpacity, Alert, PixelRatio } from 'react-native';
import * as firebase from 'firebase'
import { addNewChat, listenForNewChats, retrieveUserInfo, retrieveAllChats, getUser } from "../../db/firebaseMethods"
import { GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat'
import emojiUtils from 'emoji-utils';
import SlackMessage from "./CustomChat"
import firestore from "../../db/firebase"
import Popup from "./Popup"



export default class ChatRoom extends React.Component {
    constructor() {
        super()
        this.state = {
            messages: [],
            user: {},
            isVisible: false,
            selectedUser: {}
        }
        this.showProfileInfo = this.showProfileInfo.bind(this)
        this.listen = this.listen.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this._openPopUp = this._openPopUp.bind(this)
        this._closePopUp = this._closePopUp.bind(this)
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
            arr.forEach(val => {
                console.log(val.createdAt)
                return val.createdAt = val.createdAt.seconds * 1000
            })
            if (!arr.length) {
                arr.push({
                    _id: 1,
                    text: 'Chat is currently empty :( I need more friends!',
                    createdAt: new Date(),
                    system: true,
                    user: {
                        _id: 2,
                        name: "raven",
                        avatar: "https://cdn.dribbble.com/users/749365/screenshots/4459885/raven-best-mates.gif"
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
    async showProfileInfo(user) {
        this.setState({ selectedUser: user })
        this._openPopUp()
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
                    keyboardShouldPersistTaps={"always"}
                    onPressAvatar={(user) => this.showProfileInfo(user)}
                />
                <Popup isVisible={this.state.isVisible} duration={400} entry={'bottom'} exit={'top'}>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ textAlign: 'center', alignSelf: "center", fontFamily: "SUPRRG", fontSize: 30 }}>{this.state.selectedUser.name}</Text>
                        <Image style={{
                            width: 130,
                            height: 130,
                            borderRadius: 63,
                            borderWidth: 2,
                            borderColor: "#000000",
                            marginBottom: 10,
                            alignSelf: "center"
                        }} source={{ uri: this.state.selectedUser.avatar || "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg" }} />
                        <Text textStyle={{ textAlign: 'center' }} onPress={() => this._closePopUp()} buttonType='primary'>Close</Text>
                    </View>

                </Popup>

            </View>
        )
    }
}


