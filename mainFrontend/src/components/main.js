import React,{useContext} from "react";
import {UserContext} from "../store/context";
import { setConfig } from "../helpers";
import axios from "axios";

export default () => {

    const user = useContext(UserContext);
    const config = setConfig(user.state.token);
    const logout = () => {
        axios.post("/accounts/logout/", null , config)
        .then(
            res => user.dispatch({type:"LOGOUT"}),
            err => user.dispatch(
                {type:"LOGOUT_FAILED" ,payload : err.response.data}
            )
        );
    };

    return (
        <div>
            <h1> Hello To the main page the user is {user.state.user.username} </h1>
            <br />
            <button onClick={logout}> click here to logout </button>
        </div>
    )
}