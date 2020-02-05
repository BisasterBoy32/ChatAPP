import React, { useContext, useState } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import { setConfig } from "../../../helpers";
import { 
    UserContext,
    AlerContext, 
    NotificationContext, 
    AccountsContext,
    WebSocketContext
} from "../../../store/context";

export default ({ notification }) => {
    const userContext = useContext(UserContext);
    const alertContext = useContext(AlerContext);
    const notContext = useContext(NotificationContext);
    const accountsContext = useContext(AccountsContext);
    const webSocketContext = useContext(WebSocketContext);
    const [disabled, setDisabled] = useState(false)

    const responseToRequest = (response) => {
        const config = setConfig(userContext.state.token);
        const values = {
            id: notification.id,
            response
        }
        // disaple the batton
        setDisabled(true);
        // delete notification and update the friendship state
        axios.post("/accounts/get_notifications/", values, config)
            .then(
                res => {
                    // enables the batton
                    setDisabled(false);
                    alertContext.dispatch({
                        type: "INFO_SUCCESS",
                        payload: response === "accept"
                            ?
                            `you and ${notification.username} are friends now say hello`
                            :
                            `you rejected ${notification.username} friendship request`
                    });
                    // if he rejecte then this friendship is gonna get deleted
                    if (response === "reject") {
                        accountsContext.dispatch({
                            type: "REQUEST_REJECTED",
                            payload: notification.user
                        });
                    } else {
                        // find this user and added to the friends list
                        let friend = accountsContext.state.accounts.find(
                            account => account.id === notification.user
                        );
                        friend = {
                            active : false,
                            icon: friend.icon,
                            id: friend.id,
                            unReadMessages : 0,
                            username: friend.username,
                        }
                        accountsContext.dispatch({
                            type: "REQUEST_ACCEPTED",
                            payload: friend
                        });
                        // open a channel between this friend and 
                        // this user
                        webSocketContext.connect(friend.id);
                    }
                    // delete this notification
                    notContext.dispatch({
                        type: "DELETE_NOTIFICATION",
                        payload: notification.id
                    });
                },
                err => {
                    // enables the buttons
                    setDisabled(false);
                    alertContext.dispatch({
                        type: "INFO_ERRO",
                        payload: "something went wrong"
                    });
                }
            )
    };

    return (
        <ListItem alignItems="flex-start">
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
                        {" has sent you a friend request"}
                        {
                            disabled &&
                            <>
                                <Button
                                    style={{ margin: "4px 4px 0px 0px" }}
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => responseToRequest("accept")}
                                    disabled
                                >
                                    Accept
                        </Button>
                                <Button
                                    style={{ margin: "4px 4px 0px 0px" }}
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => responseToRequest("reject")}
                                    disabled
                                >
                                    Reject
                        </Button>
                            </>
                        }
                        {
                            !disabled &&
                            <>
                                <Button
                                    style={{ margin: "4px 4px 0px 0px" }}
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => responseToRequest("accept")}
                                >
                                    Accept
                        </Button>
                                <Button
                                    style={{ margin: "4px 4px 0px 0px" }}
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => responseToRequest("reject")}
                                >
                                    Reject
                        </Button>
                            </>
                        }
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}