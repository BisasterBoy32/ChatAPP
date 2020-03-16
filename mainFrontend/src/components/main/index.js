import React,{ useState } from "react";
import styled from "styled-components";
import Chat from "./chat/index";
import Profile from "../profile";
import ProfileInfo from "../profile/information";
import Friends from "./friends/index";
import Users from "./friends/accounts";
import Notifications from "./notifications/index.js";
import GroupForm from "./groups/group_form";
import CreateGroup from './groups';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

const Container = styled.div`
    display : flex;
    height  : 100vh;
`

const Main = styled.div`
    display : flex;
    height  : 100vh;
    padding : 3rem;
    width : 100%;
    @media (max-width: 1100px) {
        padding : 1rem;
    }
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
        <DndProvider backend={Backend}>
            {
                /* 
                <Header>
                    <Notifications></Notifications>
                    <CreateGroup></CreateGroup>
                </Header>
                */
            }

            <Container>
                    <Notifications />
                    <Profile selected={selected} setSelected={setSelected} />
                    <Main>
                        {selected === "profile" && <ProfileInfo />}
                        {selected === "friends" && <Friends />}
                        {selected === "users" && <Users />}
                        {selected === "group" && <GroupForm setSelected={setSelected}/>}
                        {selected === "friends" || selected === "users" ? <Chat></Chat> : undefined}
                    </Main>
            </Container>
        </DndProvider>
    )
}