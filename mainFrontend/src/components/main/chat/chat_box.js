import React, { useContext, useRef, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { setConfig } from "../../../helpers";

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
    const {memberTyping} = groupsContext.state;
    const group = selectedFriend && selectedFriend.username ? false : true;
    const typing = useRef(null);
    const ContainerRef = useRef(null);
    const [load, setLoad] = useState(false);
    const [fromLoad, setFromLoad] = useState(false);
    
    const loadMoreMessages = () => {  
        // if there is more messages and the scroll on top load more messages
        if (ContainerRef.current.scrollTop === 0 && accountsContext.state.loadMessages && 
            !load && ContainerRef.current.scrollHeight > ContainerRef.current.clientHeight ){ 
                const config = setConfig(userContext.state.token);
                setLoad(true);
                // load more messages if there still more
                axios.get(accountsContext.state.loadMessages ,config)
                .then(
                    res => {
                    setLoad(false);
                    const messages = res.data.results.reverse()
                    accountsContext.dispatch({
                        type: "MORE_MESSAGES",
                        payload: {
                            messages,
                            loadMessages : res.data.next
                        }
                    });
                    // indicate that this messages came from loading 
                    // more messages to prevent the scroller to point
                    // the buttom of the page
                    setFromLoad(true);
                    // reset the scroller
                    const newPosition = 206 + messages.length * 18
                    ContainerRef.current.scrollTop = newPosition
                    },
                    err => {
                        setLoad(false);
                        console.log(err.response.message)
                    }
                )
        }
    };

    useEffect(() => {
        // scroll to the bottom of the page whene the component mount
        // to see the latest messages
        ContainerRef.current.scrollTop = 10000
        // if the user loades more messages and change the selected friend
        // before the response came change the state of the load
        setLoad(false);
    }, [selectedFriend])
   
    useEffect(() => {
        // scroll to the bottom of the page whene the component mount
        // to see the latest messages
        if (!fromLoad){
            ContainerRef.current.scrollTop = 10000;
        }
        setFromLoad(false)
    }, [messages])
    
    // watch for the scrolling even to load more messages
    // if the user hit the top of the box
    useEffect(() => {
        ContainerRef.current.addEventListener("scroll",loadMoreMessages)
        return () => {
            ContainerRef.current.removeEventListener("scroll",loadMoreMessages)
        }
    }, [accountsContext.state])

    return (
        <Container ref={ContainerRef}>
            {load && <h3 style={{ textAlign : "center"}}> Loading ... </h3>}
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