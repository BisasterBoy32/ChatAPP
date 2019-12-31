import React ,{useReducer} from "react";
import { UserContext } from "./context";
import { AlerContext } from "./context";

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

        case "UPDATE_USER":
            return {
                ...state,
                user: { 
                    // update user info
                    ...state.user,
                    ...res,
                    profile : {
                        // update profile info
                        ...state.user.profile,
                        ...res.profile
                    }
                 },
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

// Error Context
const alertInitValue = {
    type: "",
    msg : ""
};

const alertReducer = (state ,action) => {
    switch(action.type){
        case "INFO_ERRO":
            return {
                ...state,
                type : "error",
                msg: action.payload
            }
        case "INFO_SUCCESS":
            return {
                ...state,
                type: "success",
                msg: action.payload
            }
        case "CLOSE_ALERT":
            return {
                ...state,
                msg: ""
            }
        default:
            return state;
    }
}




export default ({children}) => {

    const [userState , userDispatch] = useReducer(userReducer , userInitState);
    const [alertState, alertDispach] = useReducer(alertReducer, alertInitValue);

    return (
        <UserContext.Provider 
            value={{ state : userState , dispatch : userDispatch}}
        > 
            <AlerContext.Provider value={{
                state: alertState , dispatch : alertDispach
            }}>
                {children}
            </AlerContext.Provider>
        </UserContext.Provider>
    )
}