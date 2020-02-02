export const initAccountsValue = {
    accounts : [],
    friends : [],
    selectedFriend : null,
    messages : []
};

export const accountsReducer = (state, action) => {
    let {friends} = state 
    let newFriends

    switch (action.type) {
        case "LOAD_ACCOUNTS":
            return {
                ...state,
                accounts : action.payload
            }
        case "LOAD_FRIENDS":
            return {
                ...state,
                friends : action.payload
            }
        case "SELECT_FRIEND":
            // make all the selected friend 
            // messages as has been read
            newFriends = friends.map(friend => {
                if (friend.id === action.payload.id) {
                    friend.unReadMessages = 0;
                }
                return friend
            })
            return {
                ...state,
                friends : newFriends,
                selectedFriend: action.payload
            }  
        case "GET_MESSAGES":
            return {
                ...state,
                messages: action.payload
            }  
        case  "ADD_MESSAGE":
            return {
                ...state,
                messages : [
                    ...state.messages,
                    action.payload
                ]
            } 
        case  "RECIEVE_MESSAGE":
            // add 1 unReadMessage to the friend 
            // that recieved that message
            newFriends = friends.map(friend => {
                if (friend.id === action.payload.sender_id) {
                    friend.unReadMessages++;
                }
                return friend
            });
            return {
                ...state,
                friends : newFriends
            } 
        case "LOAD_ACCOUNTS_FAILED":
            return state
        default:
            return state;
    }
}