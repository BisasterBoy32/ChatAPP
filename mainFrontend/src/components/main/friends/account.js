import React, { useContext, useState } from "react";
import styled from "styled-components";
import {
    FaUserPlus,
    FaPaperPlane,
    FaUserFriends,
    FaHourglassStart,
    FaUsers,
    FaShareSquare,
    FaUserShield
} from "react-icons/fa";
import axios from "axios";
import  { setConfig } from "../../../helpers"

import {
    AccountsContext,
    AlerContext,
    UserContext,
    GroupsContext
} from "../../../store/context";



const Container = styled.div`
    border: 1px solid #dedef9;
    border-radius: 4px;
    padding: .7rem 1rem;
    width: 97%;
    display : flex;
    background-color : ${props => props.selected ? "rgb(174, 216, 219)" : "transparent"};
    position : relative;
    margin : 10px 0;
    box-shadow: 3px 4px 9px #dedef9;
`

const Username = styled.div`
    margin-left: 0.5rem;
    margin-top: .5rem;
    font-size: .9rem;
    font-weight: 700;
`
const ProfileImage = styled.div`
    width : 50px;
    height : 50px;
    background-image : url(${props => props.image});
    background-position : center;
    border-radius: 50%;
    background-size: contain;
    border : 1px solid #fff;
    position : relative;
`
const Invite = styled.div`
    font-size : .8rem;
    position : absolute;
    bottom: 2px;
    right: 3px;
    cursor : pointer;
`


export default ({ account }) => {

    const [loader , setLoader] = useState(false)
    const alertContext = useContext(AlerContext);
    const accountsContext = useContext(AccountsContext);
    const userContext = useContext(UserContext);
    const groupsContext = useContext(GroupsContext);

    // send request to join a group
    const joinGroup = () => {
        // show the loader
        setLoader(true);
        const config = setConfig(userContext.state.token);
        const values = {
            group: account.id,
            response : "group",
            type: "group request"
        }

        // send a request to join this group
        axios.post("/accounts/get_notifications/", values, config)
            .then(
                res => {
                    // hide the loader
                    setLoader(false);
                    alertContext.dispatch({
                        type: "INFO_SUCCESS",
                        payload: `you sent a request to join ${account.name} group`
                    });
                    // change the membership of this group
                    groupsContext.dispatch({
                        type: "CHANGE_MEMBERSHIP",
                        payload: account.id
                    }); 
                },
                err => {
                    // show the loader
                    setLoader(false);
                    alertContext.dispatch({
                        type: "INFO_ERRO",
                        payload: "something went wrong try again later"
                    });
                }
            )
    };

    // send a friend request
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
                        payload: `you sent a friend request ${account.username}`
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
            <Username > {account.username || account.name} </Username>
            {/* if this is a normale account */}
            {account.username &&
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
                        account.friendship === "sent" ?
                            <FaHourglassStart className="request"></FaHourglassStart> : ""
                    }
                    {
                        account.friendship === "true" ?
                            <FaUserFriends className="friend"></FaUserFriends> : ""
                    }
                </Invite>
            }
            {/* if this is account is a  group */}
            {account.name &&
                <Invite>
                    {
                        account.membership === "stranger" && loader ?
                            <div className="request-loader"></div> :
                            account.membership === "stranger" ?
                                <FaShareSquare className="add-user" onClick={joinGroup}></FaShareSquare> : ""
                    }
                    {
                        account.membership === "sent" ?
                            <FaPaperPlane className="request"></FaPaperPlane> : ""
                    }
                    {
                        account.membership === "member" ?
                            <FaUsers className="friend"></FaUsers> : ""
                    }
                    {
                        account.membership === "admin" ?
                            <FaUserShield className="friend"></FaUserShield> : ""
                    }
                </Invite>
            }
        </Container>
    )
};