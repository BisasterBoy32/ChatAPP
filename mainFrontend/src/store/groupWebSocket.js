import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { setConfig } from "../helpers";
import {
    AccountsContext,
    GroupWebSocketContext,
    UserContext
} from "./context";

// we open a channel between all the group and this user
// in the components.app after we get all the user group from
// the server check it for more information
// what we are doing here is just building a component that  
// contains the logic to open this channels and store it 
// in a context so we can access all this channels and send from it
export default ({ children }) => {
    const [websockets, setWebsockets] = useState({});
    const userContext = useContext(UserContext);
    const accountsContext = useContext(AccountsContext);
    const { selectedFriend } = accountsContext.state;

    // add message
    const add_message = (msg) => {
        // check if this message is comming or going
        // to the selected friend 'Group'
        const selectedFriendId = selectedFriend ? selectedFriend.id : null
        if (msg.group_id === selectedFriendId) {
            // add the message
            accountsContext.dispatch({
                type: "ADD_MESSAGE",
                payload: msg
            })
        } else {
            accountsContext.dispatch({
                type: "RECIEVE_MESSAGE",
                payload: msg
            })
        }

        // mark this message as has been read if the sender is the selected friend
        if (msg.sender_id === selectedFriendId) {
            const config = setConfig(userContext.state.token)
            axios.post("/message/set_message/", { message_id: msg.id }, config)
                .then(
                    res => console.log(res.data),
                    err => console.log(err.response.data)
                )
        }
    };

    // function to coonect to the web socket
    const connect = (group_id) => {

        // websocket config
        let starterURL = "ws://";
        let URL = window.location.host;
        if (window.location.href.includes("https")) {
            starterURL = "wss://";
        };
        // to open a websocket for each group
        const url_prams = `${userContext.state.token.substring(0, 8)}/${group_id}/`;
        const endpoint = `${starterURL}${URL}/group_chat/${url_prams}`;
        const ws = new WebSocket(endpoint);

        // websocket config
        ws.onopen = (res) => {
            console.log('connected' + res);
        };

        ws.onerror = (err) => {
            console.log('error : ', err)
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
            const { command, ...msg } = recieved_data;
            if (command === "new_message") {
                add_message(msg);
            };
        };

        // stock all the sockets with their group id
        // to use the correct socket of the right group
        // later when sending the message
        setWebsockets(preSockets => ({
            ...preSockets,
            [group_id]: ws
        })
        );
        return ws;
    }

    // change the ws.onmessage every time the selected friend changes
    // to be able to access the selected friend from this function(onmessage)
    // because we're using the closers so add_message func gets its outer scope(lexsecale envirement)
    // from wobsocket.onmessage
    useEffect(() => {
        for (let key in websockets) {
            if (websockets.hasOwnProperty(key)) {
                websockets[key].onmessage = (event) => {
                    const recieved_data = JSON.parse(event.data);
                    const { command, ...msg } = recieved_data;
                    if (command === "new_message") {
                        add_message(msg);
                    };
                };
            }
        };

    }, [selectedFriend]);

    return (
        // set the websocket and the connect function as values to the WebsocketContext
        <GroupWebSocketContext.Provider value={{ websockets, connect }}>
            {children}
        </GroupWebSocketContext.Provider>
    )
}