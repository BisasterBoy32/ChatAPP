export const initAccountsValue = {
    accounts : [],
    friends : [],
    selectedFriend : null,
    messages : [],
    friendTyping : false
};

export const accountsReducer = (state, action) => {
    let {friends} = state; 
    let newFriends;
    let {accounts} = state;
    let newAccounts;

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
                selectedFriend: action.payload,
                friendTyping : false
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
            };
        case "LOAD_ACCOUNTS_FAILED":
            return state;

        case "CHANGE_FRIENDSHIP":
            // after the request sended succefully
            // change the friendship state of this user
            newAccounts = accounts.map( account => {
                if (account.id === action.payload){
                    account.friendship = "holded"
                }
                return account;
            });
            return {
                ...state,
                accounts: [...newAccounts]
            }
        case "REQUEST_REJECTED":
            // after the request rejected
            // change the friendship state of this user
            newAccounts = accounts.map(account => {
                if (account.id === action.payload) {
                    account.friendship = "false"
                }
                return account;
            });
            return {
                ...state,
                accounts: [...newAccounts]
            }
        case "REQUEST_ACCEPTED":
            // after the request accepted
            // change the friendship state of this user
            newAccounts = accounts.map(account => {
                if (account.id === action.payload.id) {
                    account.friendship = "true"
                }
                return account;
            });
            // add this new friend if he doesn't exist on the friends list
            if (state.friends.find(friend => friend.id === action.payload.id)){
                newFriends = [...state.friends]
            } else {
                newFriends =  [...state.friends, action.payload]
            }
            return {
                ...state,
                accounts: [...newAccounts],
                // add the new friend
                friends: [...newFriends]
            }
            
        // search for a friend
        case "SEARCH_FRIENDS":
            return {
                ...state,
                friends : [...action.payload]
            }
        // search for a users
        case "SEARCH_ACCOUNTS":
            return {
                ...state,
                accounts: [...action.payload]
            }

        // search for a users
        case "FRIEND_TYPING":
            return {
                ...state,
                friendTyping:action.payload
            }
        default:
            return state;
    }
}
