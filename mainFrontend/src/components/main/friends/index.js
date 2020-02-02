import React, { useContext,useState } from "react";
import styled from "styled-components";
import { AccountsContext } from "../../../store/context";
import Account from "./account";
import Friend from "./friend";

const Container = styled.div`
    flex : .5;
    position : relative; 
    border : 2px solid #4F98CA;
    margin-left : .5rem;
    border-radius : 4px;
    overflow-y : scroll;
    max-height : 90vh;
`

const Title = styled.div`
    text-align : center;
    font-size : 1.4rem;
    padding : .4rem 0;
    position : sticky;
    top : 0px;
    right : 0px;
    left : 0px;
    z-index : 1;
    cursor : pointer;
    &:hover{
        color : white;
    }
    flex : .5;
    width : 100%;
    border  : ${props => props.selected ? "1px solid black" : ""};
    color  : ${props => props.selected ? "white" : "black"};
`

const Input = styled.input`
    width: 100%;
    border-top: 2px solid #4F98CA;
    font-size: 1.2rem;
    padding: .4rem;
    box-sizing: border-box;
    position: sticky;
    bottom: 0px;
    margin-top: 550px;
`

const Header = styled.div`
    display : flex;
    background-color : #4F98CA;
`

export default () => {
    const accountsContext = useContext(AccountsContext);
    const { selectedFriend } = accountsContext.state;
    const [showFriends, setShowFriends] = useState(true)

    return (
        <Container>
            <Header>
                <Title selected={showFriends} onClick={() => setShowFriends(true)}> Friends </Title>
                <Title selected={!showFriends} onClick={() => setShowFriends(false)}> All Users </Title>
            </Header>
            { showFriends && 
                accountsContext.state.friends.map(
                    friend => (
                        <Friend 
                            key={friend.username}
                            friend={friend}
                            selected={selectedFriend && friend.username === selectedFriend.username}
                        />
                    )
                )
            }
            {!showFriends &&
                accountsContext.state.accounts.map(
                account => (
                    <Account
                        key={account.username}
                        account={account}
                    />
                )
            )
            }
            <Input name="text" type="search" placeholder="Search..." />
        </Container>
    )
}