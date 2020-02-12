import React,{ useContext,useState ,useEffect} from "react";
import styled from "styled-components";
import {
    AccountsContext ,
    WebSocketContext,
    GroupWebSocketContext
} from "../../../store/context";
import ChatBox from "./chat_box";

const Container = styled.div`
    flex : 1.5;
    border : 2px solid #4F98CA;
    border-radius : 4px;
    margin-left : ${props => props.shrink ? "280px" : "1px"};
    transition : margin 300ms ease-in-out;
`

const Input = styled.input`
    width : 100%;
    border-top : 2px solid  #4F98CA;
    font-size : 1.2rem;
    padding : .4rem;
    box-sizing: border-box;
`

const Button = styled.button`
    width : 100%;
    background-color :  #4F98CA;
    font-size : 1.4rem;
    text-align : center;
    cursor : pointer;
    border : 2px solid  rgb(31, 119, 179);
    padding : .2rem;
`

export default ({showProfile}) => {
    const accountsContext = useContext(AccountsContext);
    const selectedFriend = accountsContext.state.selectedFriend;
    const websocketContext = useContext(WebSocketContext);
    const groupWebSocketContext = useContext(GroupWebSocketContext)
    const [message, setMessage] = useState("");
    
    const sendMessage = (e) => {
        e.preventDefault();
        const values = {
            command : "create_message",
            date : new Date(),
            receiver : selectedFriend.id,
            content: message
        };  
        // create new message
        // if this is a friend
        if (selectedFriend.username){
            websocketContext.websockets[selectedFriend.id].send(JSON.stringify(values));
        // if this is a group
        }else if (selectedFriend.name){
            groupWebSocketContext.websockets[selectedFriend.id].send(JSON.stringify(values));
        }
        setMessage("");
    };

    useEffect(() => {
        if (selectedFriend && selectedFriend.username){
            const data = {
                command: "friend_typing",
                typing: message === "" ? false : true
            }
            // send a signale that this friend is typing
            websocketContext.websockets[selectedFriend.id].send(JSON.stringify(data));
        }
    }, [message]);

    // each time selected friend change send a signale to
    // change is typing to false
    useEffect(() => {
        if (selectedFriend && selectedFriend.username) {
            const data = {
                command: "friend_typing",
                typing: false
            }
            // send to all friends typing is false
            for (let key in websocketContext.websockets){
                websocketContext.websockets[key].send(JSON.stringify(data));
            }
        }
    }, [selectedFriend]);

    return (
        <Container shrink={showProfile}>
            <ChatBox></ChatBox>
            <form>
                <Input 
                    name="text" 
                    value={message} 
                    type="text" 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type ypur message..."
                    />
                <Button type="submit" onClick={sendMessage}>Send</Button>
            </form>
        </Container>
    )
}