export const setConfig =  ( token ) => {
    return {
        headers : {
            authorization : `token ${token}`
        }
    }
}   