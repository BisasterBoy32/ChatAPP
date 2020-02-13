import React, { useContext } from "react";
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

class Index extends React.Component {
    state = {
        value: "",
        showFriends: true
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // each time the value of the search change 
        // send a request to serach
        if (prevState.value !== this.state.value) {
            this.search(this.state.value)
        }
    }

    componentWillUnmount() {
        console.log("bye bye!");
    }
    onInputChange = (e) => {
        // update input value
        this.setState({ ...this.state, value: e.target.value })
    }

    // each we switch between friends and allusers(accouns)
    // we set the value to "" change the state of showFriends  
    // after the value changes  because we nedd to get
    // all the friends if we switchibng for example from friends to accounts
    changeShowFriends = (choice) => {
        this.setState(
            { ...this.state, value: "" }, () => {
                this.setState({ ...this.state, showFriends: choice });
            })
    }

    search = (word) => {
        // search for this friend or account
        let values;
        const { value } = this.state;
        if (this.state.showFriends) {
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
        const config = setConfig(this.props.userContext.state.token);
        axios.post('/accounts/search/', values, config)
            .then(
                res => {
                    if (values.s_type === "friends") {
                        this.props.accountsContext.dispatch({
                            type: "SEARCH_FRIENDS",
                            payload: res.data
                        });
                    } else {
                        this.props.accountsContext.dispatch({
                            type: "SEARCH_ACCOUNTS",
                            payload: res.data
                        });
                    };
                },
                err => console.log(err.response.message)
            )
        // group search
        axios.post('/accounts/search_groups/', { word }, config)
            .then(
                res => {
                    // add all the public groups 
                    this.props.groupContext.dispatch({ type: "LOAD_PUBLIC", payload: res.data.public_groups });
                    // add all the user groups that he is a member inside them
                    this.props.groupContext.dispatch({ type: "LOAD_USER_GROUPS", payload: res.data.user_groups });
                },
                err => console.log(err.response.message)
        )  
    }

    render() {
        const { accountsContext } = this.props;
        const { groupContext } = this.props;
        const { showFriends } = this.state;
        const { value } = this.state;
        const { selectedFriend } = this.props;

        return (
            <Container>
                <Header>
                    <Title selected={showFriends} onClick={() => this.changeShowFriends(true)}> Friends </Title>
                    <Title selected={!showFriends} onClick={() => this.changeShowFriends(false)}> All Users </Title>
                </Header>
                {showFriends &&
                    accountsContext.state.friends.map(
                        friend => (
                            <Friend
                                key={friend.username}
                                friend={friend}
                                selected={selectedFriend && friend.id === selectedFriend.id}
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
                                selected={selectedFriend && friend.id === selectedFriend.id}
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
                <Input name="text" type="search" value={value} onChange={this.onInputChange} placeholder="Search..." />
            </Container>
        )
    }

}

export default () => {
    const accountsContext = useContext(AccountsContext);
    const { selectedFriend } = accountsContext.state;
    const userContext = useContext(UserContext);
    const groupContext = useContext(GroupsContext);

    return (
        <Index
            accountsContext={accountsContext}
            selectedFriend={selectedFriend}
            userContext={userContext}
            groupContext={groupContext}
        >
        </Index>
    )
}