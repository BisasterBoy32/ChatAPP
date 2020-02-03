import React ,{useReducer} from "react";
import { 
    UserContext ,
    AlerContext ,
    AccountsContext,
    NotificationContext
} from "./context";
import { alertInitValue ,alertReducer } from "./reducers/alert_reducer";
import { userInitState , userReducer} from "./reducers/user_reducer";
import { initAccountsValue , accountsReducer} from "./reducers/accounts_reducer";
import { notificationReducer, initNotificationValue } from "./reducers/notification_reducer.js";
import WebSokcetComp from "./websocket";

export default ({children}) => {

    const [userState , userDispatch] = useReducer(userReducer , userInitState);
    const [alertState, alertDispach] = useReducer(alertReducer, alertInitValue);
    const [accountsState, accountsDispatch] = useReducer(accountsReducer, initAccountsValue);
    const [notificationState, notificationDispatch] = useReducer(notificationReducer, initNotificationValue);   

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
                    <NotificationContext.Provider value={{
                        state: notificationState, dispatch: notificationDispatch
                    }}>
                        <WebSokcetComp>
                            {children}
                        </WebSokcetComp>
                    </NotificationContext.Provider>
                </AccountsContext.Provider>
            </AlerContext.Provider>
        </UserContext.Provider>
    )
}