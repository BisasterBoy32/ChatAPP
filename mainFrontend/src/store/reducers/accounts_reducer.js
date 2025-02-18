export const initAccountsValue = {
    accounts : [],
    friends : [],
    selectedFriend : null,
    messages : [],
    friendTyping : false,
    loadMessages : null
};

export const accountsReducer = (state, action) => {
    let {friends} = state; 
    let newFriends;
    let {accounts} = state;
    let newAccounts;
    let newMessages;
    let messages = [];

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
                messages: action.payload.messages,
                loadMessages : action.payload.loadMessages
            }  

        case "NO_SELECTED_FRIEND":
            return {
                ...state,
                selectedFriend: null,
            } 

        case "MORE_MESSAGES":
            // check if the loaded messages is for the current selected friend
            if ( 
                state.selectedFriend.name ?
                state.selectedFriend.id === action.payload.messages[0].group 
                :
                !action.payload.messages[0].group &&
                action.payload.messages[0].sender === state.selectedFriend.id ||
                action.payload.messages[0].receiver === state.selectedFriend.id
            ){
                // delete duplicated messages
                newMessages = [...action.payload.messages, ...state.messages]
                newMessages.filter(message => {
                    if (!messages.find(msg => msg.id === message.id)){
                        messages.push(message);
                    } 
                })
                return {
                    ...state,
                    messages,
                    loadMessages : action.payload.loadMessages
                }
            }  
            return { ...state }

        case "ADD_MESSAGE":
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
                if (friend.id === action.payload.sender) {
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

        case "FRIEND_CONNECT":
            // change the state of this friend to active
            newFriends = friends.map(friend => {
                if (friend.id === action.payload) {
                    friend.active = true;
                }
                return friend
            });
            return {
                ...state,
                friends: newFriends
            };

        case "FRIEND_DISCONNECT":
            // change the state of this friend to not active
            newFriends = friends.map(friend => {
                if (friend.id === action.payload) {
                    friend.active = false;
                }
                return friend
            });
            return {
                ...state,
                friends: newFriends
            };

        case "DELETE_FRIEND":
            newFriends = friends.filter(friend => action.payload !== friend.id);
            return {
                ...state,
                friends: newFriends
            };

        default:
            return state;
    }
}
