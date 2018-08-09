import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, WebView } from 'react-native';
import { FormInput, FormLabel } from "react-native-elements"
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { styles, SingleStreamView } from "./index"
import axios from 'axios'

export default class AllStreamView extends Component {
    constructor() {
        super()
        this.state = {streams : []}
        this.expandProfileCard = this.expandProfileCard.bind(this)
        this.handlePress = this.handlePress.bind(this)
        // this.getVideos = this.getVideos.bind(this)
    }
    static navigationOptions = {
        header: null 
    }
    async componentDidMount(){
        const searchResult = await axios({
            method: 'get',
            url: 'https://api.twitch.tv/helix/streams?first=20&game_id=33214&language=en',
            headers: {
                'Client-ID': `vhtorz83ncvg26wnz3dpt9cgzdbk94`
            }
        })
       //console.log(searchResult.data)
       let videos = searchResult.data.data
        // this.setState({
        //     streams: searchResult.data.data
        // })
        console.log('streams', videos)
        let users;
        users = await this.getUsers(videos)
        console.log('users: ', users);
        let temp = []
        for (let i = 0; i < users.length; i++){
            temp.push({video: videos[i], user: users[i]})
        }
        this.setState({
            streams: temp
        })
        // this.setState({
        //     users
        // })

       console.log('users',users)

    }

    async getUsers(streams){
        let users = []
        let ids = ''
        for(let i = 0; i < streams.length; i ++){
            if(i === 0){
                ids += ('?id='+streams[i].user_id)
            }
            else{
                ids += ('&id='+streams[i].user_id)
            } 
        }
        // streams.forEach(async stream=>{ 
        //     const user = await axios({
        //         method: 'get',
        //         url: 'https://api.twitch.tv/helix/users?id='+stream.user_id,
        //         headers: {
        //             'Client-ID': `vhtorz83ncvg26wnz3dpt9cgzdbk94`
        //         }
        //     }).then(user =>{
        //         users.push(user.data.data[0])
        //         console.log(user.data.data[0])
        //     })
        //   //  console.log(user.data.data[0])
        // })
        const user = await axios({
                    method: 'get',
                    url: 'https://api.twitch.tv/helix/users'+ids,
                    headers: {
                        'Client-ID': `vhtorz83ncvg26wnz3dpt9cgzdbk94`
                    }
                })
        //console.log(user.data.data)
        return user.data.data
        //return video.data.data[0]
      //console.log('USERS', video.data.data[0])
    }

    handlePress = (stream) => {
        const { navigate } = this.props.navigation
        navigate("SingleStreamView", {display : stream.user.display_name, login: stream.user.login})
    }


    expandProfileCard() {

    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 2 / 20, backgroundColor: "#228B22" }}>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 2 / 10, flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                            <TouchableOpacity onPress={this.expandProfileCard}>
                                <Image style={{ width: 30, height: 30, bottom: 20 }} source={require("../assets/settings.png")} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 8 / 10 }}>
                            <View>
                            
                            </View>

                        </View>

                    </View>
                </View>
                <View style={{ flex: 18 / 20 }}>
                    <ScrollView>
                    
                        <View alignItems = 'center'>
                        {this.state.streams.map(stream =>{
                                let url = stream.video.thumbnail_url.slice(0, stream.video.thumbnail_url.length - 20) + '200x100.jpg' 
                                // <Image style={styles.stretch} key = {stream.id} source ={{uri: url}}  style={{width: 200, height: 100}} />

                               // console.log('stream.thumbnailUrl: ', stream.thumbnail_url);
                                //console.log('gfgf',url )
                                return(
                                <View key = {stream.video.id}>
                                    <Card
                                        title={stream.user.display_name}
                                        image={{uri: stream.user.profile_image_url}}
                                        imageProps = {{imageProperties: {width: 200, height: 100}}}>
                                        <Text style={{marginBottom: 10}}>
                                            {stream.user.display_name}
                                        </Text>
                                        <Button onPress={() =>{const { navigate } = this.props.navigation
                                            navigate("SingleStreamView", {display : stream.user.display_name, login: stream.user.login})}}
                                            icon={<Icon name='code' color='#ffffff' />}
                                            backgroundColor='#03A9F4'
                                            //fontFamily='Lato'
                                            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                                            title='view' />
                                    </Card>
                                </View>)
                            })}
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}
