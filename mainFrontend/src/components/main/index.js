import React,{ useState } from "react";
import styled from "styled-components";
import Chat from "./chat/index";
import Profile from "../profile"
import Friends from "./friends/index";
import Notifications from "./notifications/index.js";
import CreateGroup from './groups';

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
    display : flex;
    justify-content : space-around;
`

export default () => {
    const [show, setShow] = useState(false);
        
    return (
        <div>
        <Profile show={show} setShow={setShow}/>
            <Header> 
                <Notifications></Notifications> 
                <CreateGroup></CreateGroup>
            </Header>
        <Container>
            <Chat showProfile={show}></Chat>
            <Friends></Friends>
        </Container>
        </div>
    )
}