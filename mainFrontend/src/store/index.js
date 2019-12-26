import React ,{useReducer} from "react";
import { UserContext } from "./context";

const userInitState = {
    user : { username : "anonymouse"},
    loading : true,
    token : localStorage.getItem("token")

}

const userReducer = (state , action) => {
    switch(action.type){
        case "GET_USER":
            return {
                ...state,
                user : action.payload,
                token : localStorage.getItem("token"),
                loading : false,
            }
        
        case "LOGIN_STARTED":
            return {
                ...state,
                user : { username : "anonymouse"},
                loading : true,
            }

        case "LOGOUT":
            localStorage.setItem("token", "");
            return {
                user : { username : "anonymouse"},
                loading : false,
                token : localStorage.getItem("token")
            };

        case "LOGOUT_FAILED":
            console.log(action.payload)
            return state

        case "LOGIN_FAILED":
            console.log(action.payload)
            return {
                user : { username : "anonymouse"},
                loading : false,
                token : localStorage.getItem("token")
            };

        default : 
            return state;

    }
}

export default ({children}) => {

    const [userState , userDispatch] = useReducer(userReducer , userInitState);

    return (
        <UserContext.Provider 
            value={{ state : userState , dispatch : userDispatch}}
        > 
            {children}
        </UserContext.Provider>
    )
}