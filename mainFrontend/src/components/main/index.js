import React from "react";
import styled from "styled-components";
import Chat from "./chat/index";
import Profile from "../profile"
import Friends from "./friends/index";

const Container = styled.div`
    max-width : 1300px;
    width : 98%;
    margin : auto;
    margin-top : 2rem;
    display : flex;
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

    return (
        <div>
        <Profile />
        <Header> ChatAPP </Header>
        <Container>
            <Chat></Chat>
            <Friends></Friends>
        </Container>
        </div>
    )
}