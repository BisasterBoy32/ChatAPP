import React, {useState, useEffect ,useContext} from "react";
import axios from "axios";
import {setConfig} from "../helpers";
import { 
    AccountsContext,
    WebSocketContext,
    UserContext,
    AlerContext
} from "./context";

// we open a channel between all the friends and this user
// in the components.app after we get all the friends from
// the server check it for more information
// what we are doing here is just building a component that  
// contains the logic to open this channels and store it 
// in a context so we can access all this channels and send from it
export default ({children}) => {
    const [websockets, setWebsockets] = useState({});
    const userContext = useContext(UserContext);
    const accountsContext = useContext(AccountsContext);
    const alertContext = useContext(AlerContext);
    const {selectedFriend} = accountsContext.state;
    
    // add message
    const add_message = (msg) => {
        // check if this message is comming or going
        // to the selected friend
        const selectedFriendId = selectedFriend ? selectedFriend.id : null
        if (msg.receiver === selectedFriendId || msg.sender === selectedFriendId) {
            // add the message
            accountsContext.dispatch({
                type : "ADD_MESSAGE",
                payload : msg
            })
        } else {
            accountsContext.dispatch({
                type : "RECIEVE_MESSAGE",
                payload : msg
            })    
        }

        // mark this message as has been read if the sender is the selected friend
        if (msg.sender === selectedFriendId) {   
            const config = setConfig(userContext.state.token)
            const values = {
                message_id: msg.id,
                type: "friend"
            }
            axios.post("/message/set_message/", values, config)
                .then(
                    res => console.log(res.data),
                    err => console.log(err.response.data)
                )
        }
    };

    // whene the selected friend is typing
    const friendTyping = (data) => {
        const selectedFriendId = selectedFriend ? selectedFriend.id : null
        if (selectedFriendId === data.friend){
            accountsContext.dispatch({
                type: "FRIEND_TYPING",
                payload: data.typing
            })
        }
    }

    // change the state to live whene a friend logges in
    const connectFriend = (data) => {
        const { user } = userContext.state
        const user_id = user.profile ? user.profile.user : null 
        if (data.user !== user_id) {
            accountsContext.dispatch({
                type: "FRIEND_CONNECT",
                payload: data.user
            })
        }
    }

    // change the state to live whene a friend logges in
    const disconnectFriend = (data) => {
        const { user } = userContext.state
        const user_id = user.profile ? user.profile.user : null 
        if (data.user !== user_id) {
            accountsContext.dispatch({
                type: "FRIEND_DISCONNECT",
                payload: data.user
            })
        }
    }

    const deleteFriend = (data) => {
        const selectedFriendId = selectedFriend ? selectedFriend.id : null;
        const { user } = userContext.state;
        // delete all the messages if the selected friend
        // is this friend whos has been deleted 
        if (data.friend === selectedFriendId || data.deleter === selectedFriendId){
            accountsContext.dispatch({
                type: "GET_MESSAGES",
                payload: []  
            })
        }
        // delete this friend
        // after 1s till the model unmount
        setTimeout(() => {
            accountsContext.dispatch({
                type: "DELETE_FRIEND",
                payload: data.deleter === user.profile.user ? data.friend : data.deleter
            });
            // alert that this friend has been deleted
            if (data.deleter === user.profile.user) {
                alertContext.dispatch({
                    type: "INFO_SUCCESS",
                    payload: "this friend has been delete succefully"
                });
            } else {
                alertContext.dispatch({
                    type: "INFO_ERRO",
                    payload: `${data.deleter_username} has deleted you, you are no longer friends`
                });
            }
        },100)
    };

    // function to coonect to the web socket
    const connect = (receiver_id) => {

        // websocket config
        let starterURL = "ws://";
        let URL = window.location.host;
        // this i will uncomment it on the production
        if (window.location.href.includes("https") ){
            starterURL = "wss://";
        };
        // to open a websocket for each friend
        const url_prams = `${userContext.state.token.substring(0,8)}/${receiver_id}/`;
        const endpoint = `${starterURL}${URL}/chat/${url_prams}`;
        const ws = new WebSocket(endpoint);

        // websocket config
        ws.onopen = (res) => {
            console.log('connected' + res);
        };

        ws.onerror = (err) => {
            console.log('error : ' ,err)
        };
        
        ws.onclose = (e) => {
            console.log(
                'Socket is closed. Reconnect will be attempted in 1 second.',
                '\nraison' + e.reason +
                '\nstatus' + e.code 
                );
        };

        ws.onmessage = (event) => {
            const recieved_data = JSON.parse(event.data);
            const { command , ...msg } = recieved_data;
            if ( command === "new_message"){
                add_message(msg);
            } else if (command === "friend_typing"){
                friendTyping(recieved_data)
            } else if (command === "disconnecting") {
                 disconnectFriend(recieved_data);
            } else if (command === "connecting") {
                connectFriend(recieved_data);
            }else if (command === "delete_friend") {
                deleteFriend(recieved_data);
            };
        };

        // stock all the sockets with their reciever id
        // to use the correct socket of the right receiver
        // later when sending the message
        setWebsockets(preSockets => ({
                ...preSockets,
                [receiver_id] : ws
            })
        );
        return ws;
    }

    // change the ws.onmessage every time the selected friend changes
    // to be able to access the selected friend from this function(onmessage)
    // because we're using the closers so add_message func gets its outer scope(lexsecale envirement)
    // from wobsocket.onmessage
    useEffect(() => {
        for (let key in websockets){
            if(websockets.hasOwnProperty(key)){
                websockets[key].onmessage = (event) => {
                const recieved_data = JSON.parse(event.data);
                const { command , ...msg } = recieved_data;
                    if ( command === "new_message"){
                        add_message(msg);
                    } else if (command === "friend_typing") {
                        friendTyping(recieved_data)
                    } else if (command === "disconnecting") {
                        disconnectFriend(recieved_data);
                    } else if (command === "connecting") {
                        connectFriend(recieved_data);
                    }else if (command === "delete_friend") {
                        deleteFriend(recieved_data);
                    };
                };
            }
         };

    },[selectedFriend ,userContext]);
    
    return (
        // set the websocket and the connect function as values to the WebsocketContext
        <WebSocketContext.Provider value={{ websockets ,connect }}>
        {children}
        </WebSocketContext.Provider>
    )
}