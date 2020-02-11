import React,{ useContext } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import { setConfig } from "../../../helpers";
import { 
    UserContext, 
    NotificationContext,
    GroupsContext,
    AccountsContext,
    WebSocketContext,
    GroupWebSocketContext
} from "../../../store/context";

export default ({notification}) => {
    const userContext = useContext(UserContext);
    const notContext = useContext(NotificationContext);
    const groupsContext = useContext(GroupsContext);
    const accountsContext = useContext(AccountsContext);
    const webSocketContext = useContext(WebSocketContext);
    const groupWebSocketContext = useContext(GroupWebSocketContext);

    const deleteNotify = () => {
        const values = {
            id: notification.id,
            response : "normal"
        }
        const config = setConfig(userContext.state.token);
        if (!notification.group && notification.type==="accept") {
            // find this user and added to the friends list
            let friend = accountsContext.state.accounts.find(
                account => account.id === notification.user
            );
            friend = {
                active: false,
                icon: friend.icon,
                id: friend.id,
                unReadMessages: 0,
                username: friend.username,
            }
            accountsContext.dispatch({
                type: "REQUEST_ACCEPTED",
                payload: friend
            });
            // open a channel between this friend and 
            // this user
            webSocketContext.connect(friend.id);
        } else if (notification.group && notification.type === "group accept" ){
            // get the groups
            axios.get("/accounts/groups/", config)
                .then(
                    res => {
                        // refresh all the public groups 
                        groupsContext.dispatch({ type: "LOAD_PUBLIC", payload: res.data.public_groups });
                        // refresh all the user groups that he is a member inside them
                        groupsContext.dispatch({ type: "LOAD_USER_GROUPS", payload: res.data.user_groups });
                        // disconnect all the old sockets
                        groupsContext.state.userGroups.map(group => {
                            groupWebSocketContext.websockets[group.id].send({
                                "command": "close_socket"
                            })
                        })
                        // open a channel between these group and this user
                        res.data.user_groups.map(group => {
                            groupWebSocketContext.connect(group.id);
                        });
                    },
                    err => console.log(err.response.message)
                )
        };

        // delete notification
        axios.post("/accounts/get_notifications/", values, config)
            .then(
                res => notContext.dispatch({
                        type: "DELETE_NOTIFICATION",
                        payload: notification.id
                }),
                err => alertContext.dispatch({
                        type: "INFO_ERRO",
                        payload: "something went wrong"
                })
            )
    };
    
    return (
        <ListItem alignItems="flex-start" className="accept-notify" onClick={deleteNotify}>
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={notification.icon} />
            </ListItemAvatar>
            <ListItemText
                primary="Friend Request"
                secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                        >
                            {notification.username}
                        </Typography>
                        {notification.type === "accept" && !notification.group ?
                            " Has accept your friend request" : !notification.group ? " Has rejected your friend request" : ""
                        }
                        {notification.type === "group accept" && notification.group ?
                            ` Has accept your request to join his group named ${notification.group_info.name}` 
                            : notification.group ? ` Has rejected your request to join his group named ${notification.group_info.name}` : "" 
                        }
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}