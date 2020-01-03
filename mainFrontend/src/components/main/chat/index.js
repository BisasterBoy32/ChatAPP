import React,{ useContext,useState } from "react";
import styled from "styled-components";
import { AccountsContext ,UserContext} from "../../../store/context";
import ChatBox from "./chat_box";
import { setConfig } from "../../../helpers";
import axios from "axios";

const Container = styled.div`
    flex : 1.5;
    border : 2px solid #4F98CA;
    border-radius : 4px;
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

export default () => {
    const accountsContext = useContext(AccountsContext);
    const selectedFriend = accountsContext.state.selectedFriend;
    const userContext = useContext(UserContext);
    const [message, setMessage] = useState("");

    const sendMessage = (e) => {
        e.preventDefault();
        const values = {
            date : new Date(),
            receiver : selectedFriend.id,
            content: message
        }

        // create new message
        const config = setConfig(userContext.state.token);
        axios.post("/message/", values, config)
        .then(
            res => setMessage(""),
            err => console.log(err.response.data)
        )
    };

    return (
        <Container>
            <ChatBox></ChatBox>
            <form>
                <Input 
                    name="text" 
                    value={message} 
                    type="text" 
                    onChange={(e) => setMessage(e.target.value) }
                    placeholder="Type ypur message..."
                    />
                <Button type="submit" onClick={sendMessage}>Send</Button>
            </form>
        </Container>
    )
}