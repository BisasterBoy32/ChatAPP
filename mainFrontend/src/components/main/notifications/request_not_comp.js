import React, { useContext, useState } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

export default ({ content, action, disabled, notification}) => {

    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={notification.icon} />
            </ListItemAvatar>
            <ListItemText
                primary={notification.group  ? "Group request" : "Friend Request"}
                secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                        >
                            {notification.username}
                        </Typography>
                        {content}
                        {
                            disabled &&
                            <>
                                <Button
                                    style={{ margin: "0px 4px" }}
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => action("accept")}
                                    disabled
                                >
                                    Accept
                        </Button>
                                <Button
                                    style={{ margin: "0px 4px" }}
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => action("reject")}
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
                                    style={{ margin: "0px 4px" }}
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => action("accept")}
                                >
                                    Accept
                        </Button>
                                <Button
                                    style={{ margin: "0px 4px" }}
                                    size="small"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => action("reject")}
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