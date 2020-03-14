import React,{ useState } from "react";
import styled from "styled-components";
import Chat from "./chat/index";
import Profile from "../profile";
import ProfileInfo from "../profile/information";
import Friends from "./friends/index";
import Notifications from "./notifications/index.js";
import CreateGroup from './groups';

const Container = styled.div`
    display : flex;
    height  : 100vh;
`

const Main = styled.div`
    display : flex;
    height  : 100vh;
    padding : 3rem;
    width : 100%;
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
    
    const [selected , setSelected] = useState("profile");

    return (
        <div>
        {
            /* 
            <Header>
                <Notifications></Notifications>
                <CreateGroup></CreateGroup>
            </Header>
            */
        }

        <Container>
                <Profile selected={selected} setSelected={setSelected} />
                <Main>
                    {selected === "profile" && <ProfileInfo />}
                    {selected === "friends" && <Friends />}
                    {selected === "users" && <Friends />}
                    {selected === "group" && <div> create group </div>}
                    <Chat></Chat>
                </Main>
        </Container>
        </div>
    )
}