import React , { useEffect ,useContext} from "react";
import { HashRouter , Route , Switch } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../store/context";
import { setConfig } from "../helpers";

import PrivateRoute from "./private_route";
import Main from "./main/index";
import Error from "./404";
import Alert from "./alert";

const App = () => {
    const user = useContext(UserContext);
    
    // see if there is a current user 
    useEffect( () => {
        const config = setConfig(user.state.token);
        user.dispatch({ type : "LOGIN_STARTED"});
        axios.get("/accounts/get_user/", config)
        .then( 
            res => user.dispatch({ type : "GET_USER" , payload : res.data}),
            err => user.dispatch({ type : "LOGIN_FAILED", payload : err.response})
        )
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