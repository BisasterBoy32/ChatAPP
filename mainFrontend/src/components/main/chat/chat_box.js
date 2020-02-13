import React, { useContext, useRef, useEffect } from "react";
import styled from "styled-components";

import { 
    AccountsContext,
    UserContext,
    GroupsContext
} from "../../../store/context";

const Container = styled.div`
    height: calc(100% - 5.4rem);
    padding : 0 .5rem;
    overflow-y : scroll;
    margin : .3rem 0;
`

const Content = styled.div`
    display : flex;
    align-items :center;
    margin-left : ${props => props.receiver ? "auto" : ""};
    width : max-content;
    max-width : 300px;
    margin-top : .5rem;
`

const Message = styled.div`
    background-color : #4F98CA;
    border-radius : 10px;
    padding : .3rem .6rem;
    color : rgb(38, 39, 39);
`

const ProfileImage = styled.div`
    width : 21px;
    height : 21px;
    background-image : url(${props => props.image});
    background-position : center;
    border-radius: 50%;
    background-size: contain;
    border : 1px solid #fff;
    margin-left : 5px;
`
const Typing = styled.div`
    height: 50px;
    width: 100%;
    font-size: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
`

export default () => {
    const accountsContext = useContext(AccountsContext);
    const userContext = useContext(UserContext);
    const groupsContext = useContext(GroupsContext);
    const { user } = userContext.state
    const messages = accountsContext.state.messages;
    const selectedFriend = accountsContext.state.selectedFriend;
    const {friendTyping} = accountsContext.state;
    const {memberTyping} = groupsContext.state
    const group = selectedFriend && selectedFriend.username ? false : true
    const typing = useRef(null)
    
    useEffect(() => {
        // scroll to the bottom of the page whene the component mount
            typing.current.scrollIntoView()
    }, [selectedFriend])
    

    return (
        <Container>
            {messages.length && !group
                ?
                messages.map(message => {
                    const isSender = selectedFriend.id !== message.receiver;
                    return(
                        <Content receiver={isSender} key={message.id} >
                            <Message >  {message.content}  </Message>
                            {isSender && <ProfileImage image={selectedFriend.icon} />}
                        </Content>
                    )
                })
                :
                null
            }
            {messages.length && group
                ?
                messages.map(message => {
                    const isSender = user.profile.user !== message.sender;

                    return(
                        <Content receiver={isSender} key={message.id} >
                            <Message >  {message.content}  </Message>
                            {isSender && <ProfileImage image={message.sender_info.icon} />}
                        </Content>
                    )
                })
                :
                null
            }
            {/* check if there is a friend or member typing */}
            <Typing ref={typing}>
                {friendTyping ? 
                    `${selectedFriend.username} is typing... ` : memberTyping.state ?
                        `${memberTyping.member} is typing... ` : <p>😀</p>
                }
            </Typing>
            
        </Container>
    )
}