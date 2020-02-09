import React, { useEffect, useContext } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import axios from "axios";

import { 
    UserContext,
    AccountsContext, 
    NotificationContext,
    WebSocketContext,
    GroupsContext
} from "../store/context";
import { setConfig } from "../helpers";

import PrivateRoute from "./private_route";
import Main from "./main/index";
import Error from "./404";
import Alert from "./alert";

const App = () => {
    const user = useContext(UserContext);
    const accountsContext = useContext(AccountsContext);
    const notificationContext = useContext(NotificationContext);
    const groupContext = useContext(GroupsContext);
    const webSocketContext = useContext(WebSocketContext);

    // see if there is a current user 
    useEffect(() => {
        // get the login_user
        const config = setConfig(user.state.token);
        user.dispatch({ type: "LOGIN_STARTED" });
        axios.get("/accounts/get_user/", config)
            .then(
                res => user.dispatch({ type: "GET_USER", payload: res.data }),
                err => user.dispatch({ type: "LOGIN_FAILED", payload: err.response })
            )

        // get all the users
        axios.get("/accounts/get_all/", config)
            .then(
                res => accountsContext.dispatch({ type: "LOAD_ACCOUNTS", payload: res.data }),
                err => console.log(err.response.data)
            )

        // get all friends
        axios.get("/accounts/get_friends/", config)
            .then(
                res => {
                    // add all this friends
                    accountsContext.dispatch({ type: "LOAD_FRIENDS", payload: res.data });
                    // open a channel between those friends and this user
                    res.data.map(friend => {
                        webSocketContext.connect(friend.id);
                    });
                },
                err => console.log(err.response.data)
            )

        // get the groups
        axios.get("/accounts/groups/", config)
            .then(
                res => {
                    // add all the public groups 
                    groupContext.dispatch({ type: "LOAD_PUBLIC", payload: res.data.public_groups });
                    // add all the user groups that he is a member inside them
                    groupContext.dispatch({ type: "LOAD_USER_GROUPS", payload: res.data.user_groups });
                    // open a channel between those friends and this user
                    // res.data.map(friend => {
                    //     webSocketContext.connect(friend.id);
                    // });
                },
                err => console.log(err.response.message)
            )

        // get all Notification for this user
        axios.get("/accounts/get_notifications/", config)
            .then(
                res => notificationContext.dispatch({ type: "LOAD_NOTIFICATIONS", payload: res.data }),
                err => console.log(err.response.data)
            )

    }, []);

    return (
        <HashRouter>
            <div className="container">
                <Alert />
                <Switch>
                    <PrivateRoute exact path="/" Component={Main} />
                    <Route path="" component={Error} />
                </Switch>
            </div>
        </HashRouter>
    )
}

export default App