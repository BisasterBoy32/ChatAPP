import React,{ useContext,useState ,useEffect} from "react";
import styled from "styled-components";
import {
    AccountsContext ,
    WebSocketContext,
    GroupWebSocketContext
} from "../../../store/context";
import ChatBox from "./chat_box";
import { FaPaperPlane } from "react-icons/fa";

const Container = styled.div`
    position : relative;
    flex : 1.5;
    border-radius: 12px;
    margin: 0 20px;
    border: 2px solid #dedef9;
    padding: 2rem;
`

const Input = styled.input`
    width: 100%;
    border-top: 2px solid #dedef9;
    border-radius: 28px;
    font-size: 1.2rem;
    padding: .5rem 1rem;
    box-sizing: border-box;
    &:focus {
        outline : none;
    }
`

const Name = styled.div`
    font-size : 1.2rem;
    font-weight: 700;
    margin-left: 20px;
`

const Button = styled.button`
    position : absolute;
    bottom: 32px;
    right: 40px;
    background-color :  #298bf0;
    border-radius : 50%;
    text-align : center;
    cursor : pointer;
    border : 1px solid  #298bf0;
    padding : .5rem;
    box-shadow : 2px 1px 1px #298bf0;
`

export default () => {
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
        } else if (selectedFriend && selectedFriend.name){
            const data = {
                command: "member_typing",
                typing: message === "" ? false : true
            }
            // send a signale to this group that i'm typing
            groupWebSocketContext.websockets[selectedFriend.id].send(JSON.stringify(data)); 
        }
    }, [message]);

    // each time selected friend change send a signale to
    // change is typing to false
    useEffect(() => {
        setMessage("")
        if (selectedFriend && selectedFriend.username) {
            const data = {
                command: "friend_typing",
                typing: false
            }
            // send to all friends typing is false
            for (let key in websocketContext.websockets){
                websocketContext.websockets[key].send(JSON.stringify(data));
            }
            const data2 = {
                command: "member_typing",
                typing: false 
            }
            // send a signale that this groups that i stoped typing
            for (let key in groupWebSocketContext.websockets) {
                groupWebSocketContext.websockets[key].send(JSON.stringify(data2));
            } 
        }
    }, [selectedFriend]);

    return (
        <Container>
            {selectedFriend ?
                <Name> {selectedFriend.username || selectedFriend.name } </Name> : <Name> Select a Friend to start chatting </Name>
            }
            <ChatBox></ChatBox>
            <form style={{ height : "8%"}}>
                <Input
                    name="text"
                    value={message}
                    type="text"
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type ypur message..."
                />
                <Button type="submit" onClick={sendMessage}> <FaPaperPlane style={{color : "#fff"}} /></Button>     
            </form>
        </Container>
    )
}