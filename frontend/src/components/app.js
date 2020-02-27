import React, { useEffect, useContext } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Login from "./login";
import Register from "./register/index";
import PrivateRoute from "./private_route";
import Error from "./404";
import { UserContext } from "../store/context";
import axios from "axios";
import { setConfig } from "../helpers";
import ResetPassword from "./reset_passw";
import ResetPasswordConfirm from "./reset_passw/confirm";

const App = () => {
    const user = useContext(UserContext);

    // see if there is a current user 
    useEffect(() => {

        const config = setConfig(user.state.token);
        user.dispatch({ type: "LOGIN_STARTED" });
        axios.get("/accounts/get_user/", config)
            .then(
                res => user.dispatch({ type: "GET_USER", payload: res.data }),
                err => user.dispatch({ type: "LOGIN_FAILED", payload: err.response })
            )
    }, []);

    return (
        <HashRouter>
            <div className="container">
                <Switch>
                    <PrivateRoute exact path="/register" Component={Register} />
                    <PrivateRoute exact path="/reset_confirm" Component={ResetPasswordConfirm} />
                    <PrivateRoute exact path="/reset" Component={ResetPassword} />
                    <PrivateRoute exact path="/" Component={Login} />
                    <Route path="" component={Error} />
                </Switch>
            </div>
        </HashRouter>
    )
}

export default App