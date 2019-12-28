import React , { useContext } from "react";
import { UserContext } from "../store/context"
import styled from "styled-components";

const Container = styled.div`
    position : absolute;
    top : 50px;
    left : 0px;
    bottom : 0px;
    width : 300px;
    background-color : #585858;
`


export default () => {
    const userContext = useContext(UserContext);

    return (
        <Container>
        <h1> {userContext.state.user.username} </h1>
        <img src={userContext.state.user.profile.icon} alt="user-icon"/>
        </Container>
    )
}