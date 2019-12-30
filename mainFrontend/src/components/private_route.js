import React,{ useContext } from "react";
import { UserContext } from "../store/context";
import { Route } from "react-router-dom";

export default ({ Component , ...rest }) => {
    const user = useContext(UserContext);

    if (  user.state.user.username !== "anonymouse"  )  {
        return (
            <Route {...rest} render = {props => <Component {...props} />}/>
        )
    } else if ( user.state.loading  ) {
        return ( <h1> Loading... </h1>);
    } else {
        window.location.replace('/#/');
        return null;
    }
}