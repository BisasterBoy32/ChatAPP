import React,{ useContext } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import { setConfig } from "../../../helpers";
import { UserContext, NotificationContext } from "../../../store/context";

export default ({notification}) => {
    const userContext = useContext(UserContext);
    const notContext = useContext(NotificationContext);

    const deleteNotify = () => {
        const values = {
            id: notification.id,
            response : "normal"
        }
        const config = setConfig(userContext.state.token);
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
                        {notification.type === "accept" ? " Has accept your friend request" : " Has rejected your friend request"}
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}