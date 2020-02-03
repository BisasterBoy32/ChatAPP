import React, { useContext, useState } from "react";
import styled from "styled-components";
import { FaUserPlus,FaPaperPlane,FaUserFriends } from "react-icons/fa"
import axios from "axios";
import  { setConfig } from "../../../helpers"

import {
    AccountsContext,
    AlerContext,
    UserContext
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

    const [loader , setLoader] = useState(false)
    const alertContext = useContext(AlerContext);
    const accountsContext = useContext(AccountsContext);
    const userContext = useContext(UserContext);

    const sendRequest = () => {
        // show the loader
        setLoader(true);

        const config = setConfig(userContext.state.token);

        // send a friend request to this user
        axios.post('/accounts/send_invite/', { friend: account.id }, config)
            .then(
                (res) => {
                    // change the state of the friendship for this user
                    accountsContext.dispatch({
                        type : "CHANGE_FRIENDSHIP",
                        payload : account.id
                    });
                    alertContext.dispatch({
                        type: "INFO_SUCCESS",
                        payload: "your request has been sent succefully"
                    });
                    setLoader(false);
                },
                (err) =>{
                    // show an error
                    alertContext.dispatch({
                        type: "INFO_ERRO",
                        payload: "something went wrong! try again later...."
                    });
                    // hide the loader
                    setLoader(false);
                } 
            )
    };

    return (
        <Container>
            <ProfileImage image={account.icon}></ProfileImage>
            <Username > {account.username} </Username>
            <Invite>
                {
                    account.friendship === "false" && loader ? 
                    <div className="request-loader"></div> :
                    account.friendship === "false" ? 
                    <FaUserPlus className="add-user" onClick={sendRequest}></FaUserPlus> : ""
                }
                {
                    account.friendship === "holded" ?
                    <FaPaperPlane className="request"></FaPaperPlane> : ""
                }
                {
                    account.friendship === "true" ?
                    <FaUserFriends className="friend"></FaUserFriends> : ""
                }
            </Invite>
        </Container>
    )
};