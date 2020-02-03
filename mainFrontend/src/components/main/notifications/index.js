import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { FaBell } from "react-icons/fa";

import { NotificationContext } from "../../../store/context";
import AcceptNot from "./accept_notification";
import RequestNot from "./request_not";

const useStyles = makeStyles(theme => ({
    typography: {
        padding: theme.spacing(1.5),
    },
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function SimplePopover() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const notificationContext = useContext(NotificationContext)
    const notifications = notificationContext.state
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Button aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
                Notifications
                <FaBell className="bell"></FaBell>
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <List className={classes.root}>
                    {
                        notifications.map(notification => (
                            notification.type === "request"
                                ?
                                <RequestNot key={notification.id} notification={notification} />
                                :
                                <AcceptNot key={notification.id} notification={notification} />
                        ))
                    }
                </List>
            </Popover>
        </div>
    );
}