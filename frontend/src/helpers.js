import { useState, useEffect } from "react";

export const setConfig =  ( token ) => {
    return {
        headers : {
            authorization : `token ${token}`
        }
    }
}   

// use state with a call back
export const useStateWithCallBack = (initialState , calllBack) => {
    const [state, setState] = useState(initialState);
    useEffect(() => calllBack(state) ,[state]);
    return [state , setState];
}