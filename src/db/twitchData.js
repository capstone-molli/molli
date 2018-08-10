import axios from 'axios'

const twitchData = async () =>{

    const searchResult = await axios({
        method: 'get',
        url: 'https://api.twitch.tv/helix/streams?first=20&game_id=33214&language=en',
        headers: {
            'Client-ID': `vhtorz83ncvg26wnz3dpt9cgzdbk94`
        }
    })
    let videos = searchResult.data.data
    let users;
    let ids = ''
    for(let i = 0; i < videos.length; i ++){
        if(i === 0){
            ids += ('?id='+videos[i].user_id)
        }
        else{
            ids += ('&id='+videos[i].user_id)
        } 
    }
    const user = await axios({
                method: 'get',
                url: 'https://api.twitch.tv/helix/users'+ids,
                headers: {
                    'Client-ID': `vhtorz83ncvg26wnz3dpt9cgzdbk94`
                }
            })
    users =  user.data.data
    let temp = []
    for (let i = 0; i < users.length; i++){
        temp.push({video: videos[i], user: users[i]})
    }
    return temp

}

export {twitchData}