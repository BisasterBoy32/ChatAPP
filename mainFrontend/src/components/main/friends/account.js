import React, { useContext } from "react";
import styled from "styled-components";
import { FaUserPlus,FaPaperPlane } from "react-icons/fa"

import {
    AccountsContext,
    UserContext,
} from "../../../store/context";



const Container = styled.div`
    padding : .5rem;
    display : flex;
    background-color : ${props => props.selected ? "rgb(174, 216, 219)" : "transparent"};
    position : relative;
`

const Username = styled.div`
    margin-left: 0.5rem;
    margin-top: .5rem;
    font-size: 1.3rem;
`
const ProfileImage = styled.div`
    width : 70px;
    height : 70px;
    background-image : url(${props => props.image});
    background-position : center;
    border-radius: 50%;
    background-size: contain;
    border : 1px solid #fff;
    position : relative;
`
const Invite = styled.div`
    padding : .2rem .3rem;
    font-size : .8rem;
    position : absolute;
    top : 50%;
    transform : translate-Y(-50%);
    right : 10px;
    cursor : pointer;

`


export default ({ account }) => {

    return (
        <Container>
            <ProfileImage image={account.icon}></ProfileImage>
            <Username > {account.username} </Username>
            <Invite>
                {account.friendship === "false" ? <FaUserPlus className="add-user"></FaUserPlus> : ""}
                {account.friendship === "holded" ? <FaPaperPlane className="add-user"></FaPaperPlane> : ""}
            </Invite>
        </Container>
    )
};