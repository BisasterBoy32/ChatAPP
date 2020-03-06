import React, { useContext, useState } from 'react';
import axios from "axios";
import { setConfig } from "../../../helpers";
import NotComponent from "./request_not_comp";
import { 
    UserContext,
    AlerContext, 
    NotificationContext, 
    AccountsContext,
    GroupsContext,
    WebSocketContext
} from "../../../store/context";

export default ({ notification }) => {
    const userContext = useContext(UserContext);
    const alertContext = useContext(AlerContext);
    const notContext = useContext(NotificationContext);
    const accountsContext = useContext(AccountsContext);
    const webSocketContext = useContext(WebSocketContext);
    const groupsContext = useContext(GroupsContext);
    const [disabled, setDisabled] = useState(false);

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
                        // find this user and added it to the friends list
                        axios.get(`/accounts/get_friend/${notification.user}/`, config)
                        .then(
                            res => {
                                let friend = res.data
                                accountsContext.dispatch({
                                    type: "REQUEST_ACCEPTED",
                                    payload: friend
                                });
                                // open a channel between this friend and 
                                // this user
                                webSocketContext.connect(friend.id);
                            },
                            err => {
                                console.log(err.response.data)
                            }
                        )
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

    const responseToGroupRequest = (response) => {
        const config = setConfig(userContext.state.token);
        const groupResponse = response === "accept" ? "group accept" : "group reject"
        const values = {
            id: notification.id,
            response: groupResponse
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
                            `you accepted ${notification.username} to join your group ${notification.group_info.name}`
                            :
                            `you rejected ${notification.username} to join your group ${notification.group_info.name}`
                    });
                    // if he accepted this user add him to the group members
                    if (response === "accept") {
                        // find this user and added to the friends list
                        groupsContext.dispatch({
                            type: "ADD_MEMBER",
                            payload: {
                                member: notification.user,
                                group: notification.group
                            }
                        });
                        // open a channel between this friend and 
                        // and this group
                        // webSocketContext.connect(friend.id);
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

    // if it's a notification to a friend request
    if (notification.type === "request"){
        return (
            <NotComponent 
                disabled={disabled} 
                notification={notification}
                action={responseToRequest} 
                content={" has sent you a friend request"}
            />
        )
    // if it's notification to join a group
    } else if (notification.type === "group request") {
        return (
            <NotComponent 
                disabled={disabled} 
                notification={notification}
                action={responseToGroupRequest} 
                content={` wants to join your group named ${notification.group_info.name}`} 
            />
        )
    }
}