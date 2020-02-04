import React, { useContext,useState,useEffect } from "react";
import styled from "styled-components";
import Account from "./account";
import Friend from "./friend";
import axios from "axios";
import { setConfig } from "../../../helpers"
import {
    AccountsContext,
    UserContext
} from "../../../store/context";

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
    const [showFriends, setShowFriends] = useState(true);
    const [value, setValue] = useState("");
    const userContext = useContext(UserContext);

    const onInputChange = (e) => {
        // update input value
        setValue(e.target.value);
    }

    const search = () => {
        // search for this friend or account
        let values;
        if (showFriends) {
            values = {
                s_type: "friends",
                word: value
            }
        } else {
            values = {
                s_type: "accounts",
                word: value
            }
        };
        const config = setConfig(userContext.state.token);
        axios.post('/accounts/search/', values, config)
            .then(
                res => {
                    if (showFriends) {
                        accountsContext.dispatch({
                            type : "SEARCH_FRIENDS",
                            payload : res.data
                        });
                    } else {
                        accountsContext.dispatch({
                            type: "SEARCH_ACCOUNTS",
                            payload: res.data
                        });
                    }; 
                },
                err => console.log(err.response.message)
            )
    }
    
    // set the input value to empty every time
    // we switch between friends and accounts
    useEffect(() => setValue(""), [showFriends]);
    // every time the input change send a request to search
    // for matching users or friends
    useEffect(() => search(), [value]);

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
            <Input name="text" type="search" value={value} onChange={onInputChange} placeholder="Search..." />
        </Container>
    )
}