import React, { useContext ,useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaCog } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";

import { setConfig } from "../../../helpers";
import { 
    AccountsContext,
    UserContext,
} from "../../../store/context";
import Model from "../groups/group_model";
import GroupInfo from "./group_info";


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

const EditGroup = styled.div`
    font-size: 1.2rem;
    position: absolute;
    top: 50%;
    transform: translateY(-70%);
    right: 10px;
    cursor: pointer;
    color: rgb(85, 133, 238);
`

export default ({ friend, selected }) => {
    const accountsContext = useContext(AccountsContext);
    const userContext = useContext(UserContext);
    const user_id = userContext.state.user.profile.user;
    const [open, setOpen] = useState(false);
    const [openGroupInfo, setOpenGroupInfo] = useState(false);

    const editGroup = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const getGroupMembers = () => {
        // if this is a group
        if (friend.members){
            const { friends } = accountsContext.state;
            return friends.filter(elem => friend.members.includes(elem.id))
        }
    };
    const groupMembers = getGroupMembers();
    const getSelectedFriend = () => {
        const config = setConfig(userContext.state.token);
        // if this is a friend not a group then get all the 
        // messages between this friend and the current user
        if ( friend.username ){
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
                    err => console.log(err.response.message)
                ) 
            }
        };

    return (
        <Container
            selected={selected}
            onClick={getSelectedFriend}>
            <ProfileImage image={friend.icon}>
                {friend.active && <IsActive />}
            </ProfileImage>
            <Username > {friend.username || friend.name} </Username>
            { 
                friend.unReadMessages 
                ?  
                <UnreadMessages>{friend.unReadMessages}</UnreadMessages>
                : 
                undefined 
            }
            {friend.name && friend.creator_info.id !== user_id &&
                <EditGroup onClick={() => setOpenGroupInfo(true)}><FaInfoCircle className="edit-group" /></EditGroup>
            }
            {/* if this a is group that it has a name so we can edit this group settings */}
            {friend.name && friend.creator_info.id === user_id &&
                <EditGroup onClick={editGroup}><FaCog className="edit-group" /></EditGroup>
            }
            {/*modal to change the group settings */}
            {friend.name &&
                <Model 
                    setOpen={setOpen}
                    open={open}
                    handleClose={handleClose}
                    update={true}
                    name={friend.name} 
                    type={friend.type}
                    groupId = {friend.id}
                    members={groupMembers}
                />
            }
            {friend.name &&
                <GroupInfo
                    open={openGroupInfo}
                    handleClose={() => setOpenGroupInfo(false)}
                    name={friend.name}
                    creator={friend.creator_info}
                    type={friend.type}
                    members={groupMembers}
                />
            }
        </Container>
    )  
};