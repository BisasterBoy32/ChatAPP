import React, { useContext } from "react";
import styled from "styled-components";

import { AccountsContext } from "../../../store/context";

const Container = styled.div`
    height : 80vh; 
    padding : .5rem;
`

const Message = styled.div`
    margin-left : ${props => props.receiver ? "auto" : ""};
    width : max-content;
    max-width : 300px;
    background-color : #4F98CA;
    border-radius : 10px;
    margin-top : .5rem;
    padding : .3rem .6rem;
    color : rgb(38, 39, 39);
`

export default () => {
    const accountsContext = useContext(AccountsContext);
    const messages = accountsContext.state.messages;
    const selectedFriend = accountsContext.state.selectedFriend;

    return (
        <Container>
            {messages.length
                ?
                messages.map(message => (
                    <Message
                        key={message.id}
                        receiver={selectedFriend.id !== message.receiver_id}>
                        {message.content}
                    </Message>
                ))
                :
                null
            }
        </Container>
    )
}