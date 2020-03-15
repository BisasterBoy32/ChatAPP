import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import { FaBell } from "react-icons/fa";
import styled from "styled-components";

import { NotificationContext } from "../../../store/context";
import OtherNot from "./other_notification";
import RequestNot from "./request_not";

const Wrapper = styled.div`
    position : absolute;
    width : max-content;
    top : 14px;
    right : 82px;
`;

const Container = styled.div`
    position : relative;
    width : max-content;
`;

const Bell = styled.div`
    width : max-content;
    cursor : pointer;
`

const NotificationCount = styled.div`
    position: absolute;
    right: 6px;
    border-radius: 50%;
    padding: 1px 5px;
    background-color: rgb(240,52,46);
    z-index: 1;
    top: 16px;
    font-size: .6rem;
    color: #fff;
`;


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
        <Wrapper>
            <Container>
                {notifications.length ? <NotificationCount>{notifications.length}</NotificationCount> : ""}
                <Bell onClick={handleClick}>
                    <FaBell className="bell"></FaBell>
                </Bell>
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
                                notification.type === "request" || notification.type === "group request"
                                    ?
                                    <RequestNot key={notification.id} notification={notification} />
                                    :
                                    <OtherNot key={notification.id} notification={notification} />
                            ))
                        }
                    </List>
                </Popover>
            </Container>
        </Wrapper>
    );
}