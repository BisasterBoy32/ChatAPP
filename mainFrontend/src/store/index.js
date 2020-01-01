import React ,{useReducer} from "react";
import { UserContext } from "./context";
import { AlerContext } from "./context";
import { AccountsContext } from "./context";
import { alertInitValue ,alertReducer } from "./reducers/alert_reducer";
import { userInitState , userReducer} from "./reducers/user_reducer";
import { initAccountsValue , accountsReducer} from "./reducers/accounts_reducer"

export default ({children}) => {

    const [userState , userDispatch] = useReducer(userReducer , userInitState);
    const [alertState, alertDispach] = useReducer(alertReducer, alertInitValue);
    const [accountsState, accountsDispatch] = useReducer(accountsReducer, initAccountsValue)
 
    return (
        <UserContext.Provider 
            value={{ state : userState , dispatch : userDispatch}}
        > 
            <AlerContext.Provider value={{
                state: alertState , dispatch : alertDispach
            }}>
                <AccountsContext.Provider value={{
                    state : accountsState , dispatch : accountsDispatch
                }}>
                    {children}
                </AccountsContext.Provider>
            </AlerContext.Provider>
        </UserContext.Provider>
    )
}