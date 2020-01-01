import React, { useContext } from "react";
import styled from "styled-components";
import { AccountsContext } from "../../../store/context";
import Account from "./account";

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
    background-color : #4F98CA;
    font-size : 1.4rem;
    padding : .2rem;
    position : sticky;
    top : 0px;
    right : 0px;
    left : 0px;
    z-index : 1;
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

export default () => {
    const accountsContext = useContext(AccountsContext);
    const { selectedFriend } = accountsContext.state
    
    return (
        <Container>
            <Title > Friends </Title>
            {accountsContext.state.accounts.map(
                account => (
                    <Account
                        key={account.username}
                        account={account}
                        selected={selectedFriend && account.username === selectedFriend.username}
                    />
                )
            )
            }
            <Input name="text" type="search" placeholder="Search..." />
        </Container>
    )
}