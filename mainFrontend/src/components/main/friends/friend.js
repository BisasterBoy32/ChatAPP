import React, { useContext } from "react";
import styled from "styled-components";
import axios from "axios";

import { setConfig } from "../../../helpers";
import { 
    AccountsContext,
    UserContext,
} from "../../../store/context";



const Container = styled.div`
    padding : .5rem;
    display : flex;
    cursor : pointer;
    background-color : ${props => props.selected ? "rgb(174, 216, 219)" : "transparent"};
    &:hover {
        background-color : rgb(174, 216, 219);
    }
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

const IsActive = styled.div`
    width: 15px;
    height: 15px;
    background-color: rgb(97, 252, 118);;
    border-radius: 50%;
    position: absolute;
    bottom: 2px;
    right: 3px;
    border: 1px solid #fff;
`

const UnreadMessages = styled.div`
position: absolute;
background-color: rgb(243,83,83);
color: #fff;
border-radius: 50%;
width: 25px;
height: 25px;
padding: 4px;
text-align: center;
right: 30px;
top: 50%;
transform: translateY(-50%);
`

export default ({ friend, selected }) => {
    const accountsContext = useContext(AccountsContext);
    const userContext = useContext(UserContext);
    
    const getSelectedFriend = () => {
        const config = setConfig(userContext.state.token);

        axios.get(`/message/get_messages?r_id=${friend.id}`, config)
            .then(
                res => {
                    // change the selected friend
                    accountsContext.dispatch({
                        type: "SELECT_FRIEND",
                        payload: friend
                    });
                    // get the selected friend messages
                    accountsContext.dispatch({
                        type: "GET_MESSAGES",
                        payload: res.data
                    })
                },
                err => console.log(err.response.data)
            )   
        };

    return (
        <Container
            selected={selected}
            onClick={getSelectedFriend}>
            <ProfileImage image={friend.icon}>
                {friend.active && <IsActive />}
            </ProfileImage>
            <Username > {friend.username} </Username>
            { 
                friend.unReadMessages 
                ?  
                <UnreadMessages>{friend.unReadMessages}</UnreadMessages>
                : 
                undefined 
            }
        </Container>
    )  
};