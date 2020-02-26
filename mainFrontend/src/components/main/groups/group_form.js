import React, {useState, useContext } from "react";
import styled from "styled-components";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import  { 
    AccountsContext ,
    AlerContext,
    UserContext,
    GroupsContext,
    GroupWebSocketContext
} from "../../../store/context";
import Friend from "./friend";
import MembersBox from "./members_box";
import Button from '@material-ui/core/Button';
import axios from "axios";
import { setConfig } from "../../../helpers";

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
    padding-bottom : .8rem;
    margin-bottom : 1rem;
    border-bottom : 2px solid #ccc;
`
const MembersTitle = styled.legend`
    margin-top : 1rem;
    margin-bottom : .5rem;
`


const useStyles = makeStyles(theme => ({
    name : {
        width : "100%",
    },
    radius : {
        marginTop : "1rem"
    }
}));


export default ({ name, type, members, update, setOpen, groupId}) => {
    const classes = useStyles();
    const [value, setValue] = useState(type || 'public');
    const [groupName, setGroupName] = useState(name || '');
    const [groupMembers, setGroupMembers] = useState(members || []);
    // to disable the button whene with send a request
    // to the server to create this new group
    const [request, setRequest] = useState(false);
    const accountsContext = useContext(AccountsContext);
    const alertContext = useContext(AlerContext);
    const userContext = useContext(UserContext);
    const groupsContext = useContext(GroupsContext);
    const groupWebSocketContext = useContext(GroupWebSocketContext);
    const { friends } = accountsContext.state
    const notMembers = friends.filter(friend => {
        if (!groupMembers.find(member => member.id === friend.id)){
            return friend;
        }
    })
    const radioValueChanged = event => {
        setValue(event.target.value);
    };

    // add a group 
    const addGroup = (config, values) => {
        axios.post("/accounts/groups/", values, config)
            .then(
                res => {
                    // enable the button
                    setRequest(false);
                    // add this group to the current groups
                    groupsContext.dispatch({
                        type: "ADD_GROUP",
                        payload: res.data
                    });
                    alertContext.dispatch({
                        type: "INFO_SUCCESS",
                        payload: `your group ${res.data.name} has been created succefully`
                    });
                    // close the modal
                    setOpen(false);
                    // open a socket for this group
                    groupWebSocketContext.connect(res.data.id)
                },
                err => {
                    // enable the button
                    setRequest(false);
                    console.log(err.response.message);
                    alertContext.dispatch({
                        type: "INFO_ERRO",
                        payload: "Something went wrong try again"
                    });
                }
            )
    };

    // update an existing group
    const updateGroup = (config, values) => {
        axios.put(`/accounts/groups/${groupId}/`, values, config)
            .then(
                res => {
                    // enable the button
                    setRequest(false);
                    // add this group to the current groups
                    groupsContext.dispatch({
                        type: "UPDATE_GROUP",
                        payload: res.data
                    });
                    alertContext.dispatch({
                        type: "INFO_SUCCESS",
                        payload: `your group ${res.data.name} has been updated succefully`
                    });
                    // close the modal
                    setOpen(false);
                },
                err => {
                    // enable the button
                    setRequest(false);
                    console.log(err.response.message);
                    alertContext.dispatch({
                        type: "INFO_ERRO",
                        payload: "Something went wrong try again later please"
                    });
                }
            )
    };

    const onButtonClicked = (action) => {
        // validation 
        if (!groupMembers.length){
            alertContext.dispatch({
                type: "INFO_ERRO",
                payload : "You have to provide at least one member to the group"
            });
        } else if (!groupName){
            alertContext.dispatch({
                type: "INFO_ERRO",
                payload: "You have to provide a name for your group"
            });
        }else {
            // disable the button
            setRequest(true);
            const members = groupMembers.map(member => member.id);
            const values = {
                name: groupName,
                type: value,
                members
            }
            const config = setConfig(userContext.state.token);
            if (action === "create"){
                addGroup(config, values);
            } else if (action === "update"){
                updateGroup(config, values);
            }
        }
    }

    const deleteGroup = () => {
        const data = { 
            "command" : "delete_group",
            "group": groupId
        }
        setRequest(true);
        groupWebSocketContext.websockets[groupId].send(JSON.stringify(data));
        setTimeout(() => setRequest(false),1000);
    };

    return (
        <Container>
            <Form>
                <Title> Create a new group </Title>
                <TextField 
                    className={classes.name}  
                    label="Group Name" 
                    value={groupName} 
                    onChange={e => setGroupName(e.target.value)}
                />
                <FormLabel className={classes.radius} component="legend">Type</FormLabel>
                <RadioGroup aria-label="type" name="type" value={value} onChange={radioValueChanged}>
                    <FormControlLabel value="private" control={<Radio />} label="Private" />
                    <FormControlLabel value="public" control={<Radio />} label="Public" />
                </RadioGroup>
                <MembersTitle>Members</MembersTitle>
                <MembersBox groupMembers={groupMembers} setGroupMembers={setGroupMembers} />
                {!update && !request &&
                    <Button variant="contained" color="primary" onClick={() => onButtonClicked("create")}>
                        Create
                    </Button>   
                }
                {!update && request &&
                    <Button variant="contained" color="primary" disabled>
                        Create
                    </Button>
                }
                {update && !request &&
                    <Button variant="contained" color="primary" onClick={() => onButtonClicked("update")}>
                        Update
                    </Button>
                }
                {update && !request &&
                    <Button variant="contained" color="secondary" style={{marginLeft : "5px"}} onClick={deleteGroup}>
                        Delete
                    </Button>
                }
                {update && request &&
                    <Button variant="contained" color="primary" disabled>
                        Update
                    </Button>
                }
                {update && request &&
                    <Button variant="contained" color="secondary" style={{ marginLeft: "5px" }} disabled>
                        Delete
                    </Button>
                }
            </Form>
            <FriendList> {notMembers.map(friend => (
                <Friend 
                    friend={friend} 
                    key={friend.id}
                    onDrop={() => setGroupMembers([...groupMembers,friend])}
                >
                </Friend>
                ))} </FriendList>
        </Container>
    )
}