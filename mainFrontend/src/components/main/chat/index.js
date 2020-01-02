import React,{ useContext } from "react";
import styled from "styled-components";
import { AccountsContext } from "../../../store/context";
import ChatBox from "./chat_box";

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
    const messages = accountsContext.state.messages;
    const selectedFriend = accountsContext.state.selectedFriend;

    return (
        <Container>
            <ChatBox></ChatBox>
            <form>
                <Input name="text" type="text" placeholder="Type ypur message..."/>
                <Button type="submit" >Send</Button>
            </form>
        </Container>
    )
}