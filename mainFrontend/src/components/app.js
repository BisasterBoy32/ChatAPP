import React , { useEffect ,useContext} from "react";
import { HashRouter , Route , Switch } from "react-router-dom";
import axios from "axios";

import { UserContext ,AccountsContext} from "../store/context";
import { setConfig } from "../helpers";

import PrivateRoute from "./private_route";
import Main from "./main/index";
import Error from "./404";
import Alert from "./alert";

const App = () => {
    const user = useContext(UserContext);
    const accountsContext = useContext(AccountsContext)

    // websocket config
    let starterURL = "ws://";
    const URL = window.location.host;
    if (window.location.href.includes("https") ){
        starterURL = "wss://";
    };
    const endpoint = starterURL + URL + '/chat/'
    const ws = new WebSocket(endpoint);

    // see if there is a current user 
    useEffect( () => {
        // get the login_user
        const config = setConfig(user.state.token);
        user.dispatch({ type : "LOGIN_STARTED"});
        axios.get("/accounts/get_user/", config)
        .then( 
            res => user.dispatch({ type : "GET_USER" , payload : res.data}),
            err => user.dispatch({ type : "LOGIN_FAILED", payload : err.response})
        )

        // get all the users and friends
        axios.get("/accounts/get_all/", config)
            .then(
                res => accountsContext.dispatch({ type: "LOAD_ACCOUNTS", payload: res.data }),
                err => console.log(err.response.data)
            )
        
        // websocket config
        ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
        };
        ws.onmessage = (event) => {
            // on connecting, do nothing but log it to the console
            console.log('event : ' ,event)
        };
        ws.onerror = (err) => {
            // on connecting, do nothing but log it to the console
            console.log('error : ' ,err)
        };
    },[]);

    return (
        <HashRouter>
        <div className="container">
            <Alert />
            <Switch>
                <PrivateRoute exact path="/"  Component={Main} />
                <Route path="" component={Error} />
            </Switch>
        </div>
        </HashRouter>
    )
}

export default App