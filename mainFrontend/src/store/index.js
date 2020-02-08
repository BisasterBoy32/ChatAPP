import React ,{useReducer} from "react";
import { 
    UserContext ,
    AlerContext ,
    AccountsContext,
    NotificationContext,
    GroupsContext
} from "./context";
import { alertInitValue ,alertReducer } from "./reducers/alert_reducer";
import { userInitState , userReducer} from "./reducers/user_reducer";
import { initAccountsValue , accountsReducer} from "./reducers/accounts_reducer";
import { notificationReducer, initNotificationValue } from "./reducers/notification_reducer.js";
import { initGroupsValue, groupsReducer } from "./reducers/groups_reducer.js";
import WebSokcetComp from "./websocket";

export default ({children}) => {

    const [userState , userDispatch] = useReducer(userReducer , userInitState);
    const [alertState, alertDispach] = useReducer(alertReducer, alertInitValue);
    const [accountsState, accountsDispatch] = useReducer(accountsReducer, initAccountsValue);
    const [notificationState, notificationDispatch] = useReducer(notificationReducer, initNotificationValue);   
    const [groupsState, groupsDispatch] = useReducer(groupsReducer ,initGroupsValue)

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
                    <GroupsContext.Provider value={{
                        state: groupsState, dispatch: groupsDispatch
                    }}>
                        <NotificationContext.Provider value={{
                            state: notificationState, dispatch: notificationDispatch
                        }}>
                            <WebSokcetComp>
                                {children}
                            </WebSokcetComp>
                        </NotificationContext.Provider>
                    </GroupsContext.Provider>
                </AccountsContext.Provider>
            </AlerContext.Provider>
        </UserContext.Provider>
    )
}