import React, { useContext ,useState ,useEffect} from "react";
import styled from "styled-components";
import Account from "./account";
import Friend from "./friend";
import axios from "axios";
import { setConfig } from "../../../helpers"
import {
    AccountsContext,
    UserContext,
    GroupsContext
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
    const userContext = useContext(UserContext);
    const groupContext = useContext(GroupsContext);
    const [value ,setValue] = useState('');
    const [showFriends, setShowFriends] = useState(true);

    // each time the value of the search change 
    // send a request to serach
    useEffect(() =>{
        let canceled = {state : false};
        search(value, canceled);
        return () => {
            canceled.state = true;
        }
    }, [value]);

    const onInputChange = (e) => {
        // update input value
        setValue(e.target.value);
    }

    // each we switch between friends and allusers(accouns)
    // we set the value to "" change the state of showFriends  
    // after the value changes  because we nedd to get
    // all the friends if we switchibng for example from friends to accounts
    const changeShowFriends = (choice) => {
        setValue("");
        setTimeout(() => setShowFriends(choice),100);
    }

    const search = async (word, canceled) => {
        // search for this friend or account
        let values;
        if (showFriends) {
            values = {
                s_type: "friends",
                word: word
            }
        } else {
            values = {
                s_type: "accounts",
                word: word
            }
        };
        const config = setConfig(userContext.state.token);
        // friends search
        const res = await axios.post('/accounts/search/', values, config)
        // groups search
        const g_res = await axios.post('/accounts/search_groups/', { word }, config)
        if (!canceled.state) {
            try {
                if (values.s_type === "friends") {
                    accountsContext.dispatch({
                        type: "SEARCH_FRIENDS",
                        payload: res.data
                    });
                } else {
                    accountsContext.dispatch({
                        type: "SEARCH_ACCOUNTS",
                        payload: res.data
                    });
                };
            } catch (err) {
                console.log(err.response.message)
            }
        }
        if (!canceled.state) {
            try {
                // add all the public groups 
                groupContext.dispatch({ type: "LOAD_PUBLIC", payload: g_res.data.public_groups });
                // add all the user groups that he is a member inside them
                groupContext.dispatch({ type: "LOAD_USER_GROUPS", payload: g_res.data.user_groups });
            } catch (err) {
                console.log(err.response.message)
            }
        }
    }      

    return (
        <Container>
            <Header>
                <Title selected={showFriends} onClick={() => changeShowFriends(true)}> Friends </Title>
                <Title selected={!showFriends} onClick={() => changeShowFriends(false)}> All Users </Title>
            </Header>
            {showFriends &&
                accountsContext.state.friends.map(
                    friend => (
                        <Friend
                            key={friend.username}
                            friend={friend}
                            selected={
                                selectedFriend && selectedFriend.username &&
                                friend.username === selectedFriend.username
                            }
                        />
                    )
                )
            }
            {showFriends &&
                groupContext.state.userGroups.map(
                    friend => (
                        <Friend
                            key={friend.id}
                            friend={friend}
                            selected={
                                selectedFriend && selectedFriend.name &&
                                friend.name === selectedFriend.name
                            }
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
            {!showFriends &&
                groupContext.state.groups.map(
                    account => (
                        <Account
                            key={account.id}
                            account={account}
                        />
                    )
                )
            }
        <Input name="text" type="search" value={value} onChange={onInputChange} placeholder="Search..." />
    </Container>
    )
}