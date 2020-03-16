import React, { useContext ,useState ,useEffect} from "react";
import styled from "styled-components";
import Friend from "./friend";
import axios from "axios";
import { setConfig } from "../../../helpers"
import {
    AccountsContext,
    UserContext,
    GroupsContext
} from "../../../store/context";
import { FaSearch } from "react-icons/fa";

const Container = styled.div`
    margin-left : .5rem;
    border-radius : 4px;
    overflow-y : scroll;
    max-height : 90vh;
    min-width: 290px;
    @media (max-width: 1000px) {
        min-width: 230px;
    }
    @media (max-width: 900px) {
        margin-left : 1.5rem;
    }
`
const Title = styled.div`
    font-size : 1.3rem;
    font-weight : 700;
`

const SearchBar = styled.div`
    position : relative;
    margin-top: 50px;
`
const SearchIcon = styled.div`
    position: absolute;
    left: 6px;
    top: 11px;
    color :  #dedef9;
`

const Input = styled.input`
    width: 95%;
    border-radius : 20px;
    border : 2px solid #dedef9;
    font-size: 1.2rem;
    padding: .4rem .2rem .4rem 1.6rem;
    box-sizing: border-box;
    bottom: 0px;
    margin-bottom: 15px;
    box-shadow: 3px 4px 9px #dedef9;
    &:focus{
        outline : none;
    }
`

export default () => {
    const accountsContext = useContext(AccountsContext);
    const { selectedFriend } = accountsContext.state;
    const userContext = useContext(UserContext);
    const groupContext = useContext(GroupsContext);
    const [value ,setValue] = useState('');
    const [load, setLoad] = useState(false);

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

    const search = async (word, canceled) => {
        // search for this friend or account
        let values;
        values = {
            s_type: "friends",
            word: word
        }
        const config = setConfig(userContext.state.token);
        // friends search
        const res = await axios.post('/accounts/search/', values, config)
        // groups search
        const g_res = await axios.post('/accounts/search_groups/', { word }, config)
        if (!canceled.state) {
            try {
                    accountsContext.dispatch({
                        type: "SEARCH_FRIENDS",
                        payload: res.data
                    });
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
        <Container className="animated bounceInRight">
            <Title> Friends And Groups </Title>
            <SearchBar>
                <SearchIcon><FaSearch /></SearchIcon>
                <Input name="text" type="search" value={value} onChange={onInputChange} placeholder="Search..." />
            </SearchBar>
            {
                accountsContext.state.friends.map(
                    friend => (
                        <Friend
                            load={load}
                            setLoad={setLoad}
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
            {
                groupContext.state.userGroups.map(
                    friend => (
                        <Friend
                            load={load}
                            setLoad={setLoad}
                            key={friend.id}
                            friend={friend}
                            selected={
                                selectedFriend && selectedFriend.name &&
                                friend.id === selectedFriend.id
                            }
                        />
                    )
                )
            }
    </Container>
    )
}