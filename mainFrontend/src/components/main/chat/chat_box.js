import React, { useContext } from "react";
import styled from "styled-components";

import { AccountsContext } from "../../../store/context";

const Container = styled.div`
    height : 80vh; 
    padding : .5rem;
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

export default () => {
    const accountsContext = useContext(AccountsContext);
    const messages = accountsContext.state.messages;
    const selectedFriend = accountsContext.state.selectedFriend;

    return (
        <Container>
            {messages.length
                ?
                messages.map(message => {
                    const isSender = selectedFriend.id !== message.receiver_id;

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
        </Container>
    )
}