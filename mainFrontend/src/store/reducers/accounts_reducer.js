export const initAccountsValue = {
    accounts : [],
    friends : [],
    selectedFriend : null,
    messages : []
};

export const accountsReducer = (state, action) => {

    switch (action.type) {
        case "LOAD_ACCOUNTS":
            return {
                ...state,
                accounts : action.payload
            }
        case "SELECT_FRIEND":
            return {
                ...state,
                selectedFriend: action.payload
            }  
        case "GET_MESSAGES":
            return {
                ...state,
                messages: action.payload
            }   
        case "LOAD_ACCOUNTS_FAILED":
            return state
        default:
            return state;
    }
}