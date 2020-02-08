import React, {useState, useContext } from "react";
import styled from "styled-components";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import  { AccountsContext } from "../../../store/context";
import Friend from "./friend";


const Container = styled.div`
    display : flex;
    width : 600px;
    height : 500px;
`

const FriendList = styled.div`
    flex : .5;
    overflow-y : scroll;
    padding : 1rem 0 1rem 1.5rem;
`

const Form = styled.form`
    flex : 1.5;
    padding : 1rem 0 1rem 1rem;
`

const Title = styled.legend`
    font-size : 1.3rem;
    text-align : center;
    padding-bottom : 1rem;
    margin-bottom : 1.5rem;
    border-bottom : 2px solid #ccc;
`
const MembersTitle = styled.legend`
    margin-top : 1rem;
    margin-bottom : .5rem;
`

const Friendsbox = styled.div`
    border : 1px solid black;
    padding : .5rem;
    overflow-y : scroll;
    height : 200px;
`

const useStyles = makeStyles(theme => ({
    name : {
        width : "100%",
    },
    radius : {
        marginTop : "1rem"
    }
}));


export default () => {
    const classes = useStyles();
    const [value, setValue] = useState('public');
    const accountsContext = useContext(AccountsContext);
    const { friends } = accountsContext.state
    const handleChange = event => {
        setValue(event.target.value);
    };

    return (
        <Container>
            <Form>
                <Title> Create a new group </Title>
                <TextField className={classes.name}  label="Group Name" />
                <FormLabel className={classes.radius} component="legend">Type</FormLabel>
                <RadioGroup aria-label="type" name="type" value={value} onChange={handleChange}>
                    <FormControlLabel value="private" control={<Radio />} label="Private" />
                    <FormControlLabel value="public" control={<Radio />} label="Public" />
                </RadioGroup>
                <MembersTitle>Members</MembersTitle>
                <Friendsbox> Drage and Drop the members here </Friendsbox>
            </Form>
            <FriendList> {friends.map(friend => <Friend friend={friend} key={friend.id}></Friend>)} </FriendList>
        </Container>
    )
}