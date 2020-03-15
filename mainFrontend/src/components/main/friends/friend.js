import React, { useContext ,useState ,useEffect} from "react";
import styled from "styled-components";
import axios from "axios";
import { FaCog } from "react-icons/fa";
import { FaInfoCircle ,FaTimes } from "react-icons/fa";
import { setConfig } from "../../../helpers";
import { 
    AccountsContext,
    UserContext,
    GroupsContext
} from "../../../store/context";
import Model from "../groups/group_model";
import GroupInfo from "./group_info";


const Container = styled.div`
    border: 1px solid #dedef9;
    border-radius: 4px;
    padding: .7rem 1rem;
    width: 97%;
    display : flex;
    cursor : ${props => props.loaded ? "wait" : "pointer"};
    background-color : ${props => props.selected ? "rgb(174, 216, 219)" : "transparent"};
    &:hover {
        background-color : rgb(174, 216, 219);
    }
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

const IsActive = styled.div`
    width: 10px;
    height: 10px;
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
    width: 16px;
    height: 16px;
    padding: 2px;
    text-align: center;
    right: 13px;
    font-size: 11px;
    bottom: 17px;
`

const EditGroup = styled.div`
    font-size: 1rem;
    position: absolute;
    top: 8px;
    right: 12px;
    cursor: pointer;
    color: rgb(85,133,238);
`

export default ({ friend, selected ,load ,setLoad}) => {
    const accountsContext = useContext(AccountsContext);
    const userContext = useContext(UserContext);
    const groupsContext = useContext(GroupsContext);
    const user_id = userContext.state.user.profile.user;
    const [open, setOpen] = useState(false);
    const [openGroupInfo, setOpenGroupInfo] = useState(false);

    // whene the component unmount close the settings modal
    useEffect(() => {
        return () =>{
            setOpen(false);
            setOpenGroupInfo(false);
        } 
    },[]);

    const editGroup = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const getGroupMembers = () => {
        // if this is a group
        if (friend.members){
            const { accounts } = accountsContext.state;
            return accounts.filter(elem => friend.members.includes(elem.id))
        }
    };
    const groupMembers = getGroupMembers();
    const getSelectedFriend = () => {
        // if we are not in the proccess of selecting
        // a friend than select this friend
        if (!load) {
            setLoad(true);
            // delete all the previous messages
            accountsContext.dispatch({
                type: "GET_MESSAGES",
                payload: {
                    messages : [],
                    loadMessages : null
                }
            });
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
                            const messages = res.data.results.reverse()
                            accountsContext.dispatch({
                                type: "GET_MESSAGES",
                                payload: {
                                    messages,
                                    loadMessages : res.data.next
                                }
                            });
                            setLoad(false);
                        },
                        err => console.log(err.response.message)
                    ) 
            } else if (friend.name){
                // get all the group messages
                axios.get(`/message/group_messages?g_id=${friend.id}`, config)
                    .then(
                        res => { 
                            const messages = res.data.results.reverse()
                            // store the selected friend messages
                            accountsContext.dispatch({
                                type: "GET_MESSAGES",
                                payload: {
                                    messages,
                                    loadMessages : res.data.next
                                }
                            })
                            // change the selected friend
                            accountsContext.dispatch({
                                type: "SELECT_FRIEND",
                                payload: friend
                            });
                            // mark all the selected group message as has been read
                            groupsContext.dispatch({
                                type: "SELECT_FRIEND",
                                payload: friend
                            });
                            setLoad(false);
                        },
                        err => console.log(err.response.message)
                    )    
            }
        }
    };

    return (
        <>
        <Container
            loaded={load}
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
                <EditGroup onClick={(e) => { 
                    setOpenGroupInfo(true); 
                    e.stopPropagation();
                }}>
                    <FaInfoCircle className="edit-group" /></EditGroup>
            }
            {/* if this a is group that it has a name so we can edit this group settings */}
            {friend.name && friend.creator_info.id === user_id &&
                <EditGroup onClick={editGroup}><FaCog className="edit-group" /></EditGroup>
            }
        </Container>
            {/*modal to change the group settings */}
            {friend.name &&
                <Model 
                    setOpen={setOpen}
                    open={open}
                    handleClose={handleClose}
                    update={true}
                    name={friend.name} 
                    type={friend.type}
                    icon1={friend.icon}
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
        </>
    )  
};