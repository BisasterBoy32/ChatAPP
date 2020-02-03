import React,{ useState, useEffect,useContext } from "react";
import styled from "styled-components";
import Chat from "./chat/index";
import Profile from "../profile"
import Friends from "./friends/index";
import {AccountsContext, WebSocketContext} from "../../store/context";
import Notifications from "./notifications/index.js";

const Container = styled.div`
    max-width : 1300px;
    width : 98%;
    margin : auto;
    margin-top : 2rem;
    display : flex;
    height : calc(100vh - 5rem);
`

const Header = styled.div`
    width : 100%;
    background-color : #4F98CA;
    text-align : center;
    font-size : 1.5rem;
    font-weigth : 700;
    padding : .5rem;
`

export default () => {
    const [show, setShow] = useState(false);
    const accountsContext = useContext(AccountsContext);
    const friends = accountsContext.state.friends;
    const webSocketContext = useContext(WebSocketContext);

    // open channels between all friends    
    useEffect(() => {
        friends.map(friend => {
            webSocketContext.connect(friend.id);
        })
    },[friends.length])
        
    return (
        <div>
        <Profile show={show} setShow={setShow}/>
            <Header> <Notifications></Notifications> </Header>
        <Container>
            <Chat showProfile={show}></Chat>
            <Friends></Friends>
        </Container>
        </div>
    )
}