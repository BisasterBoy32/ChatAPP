export const initGroupsValue = {
    groups : [],
    userGroups : []
}

export const groupsReducer = (state, action) => {
    let newGroups;

    switch (action.type){
        case "LOAD_PUBLIC":
            return {
                ...state,
                groups : [...action.payload]
            };

        case "LOAD_USER_GROUPS":
            return {
                ...state,
                userGroups: [...action.payload]
            };

        case "ADD_GROUP":
            return {
                ...state,
                userGroups: [
                    ...state.userGroups,
                    action.payload
                ]
            };

        case "UPDATE_GROUP":
            // replace the updated one with 
            // the new group
            newGroups = state.userGroups.map(group => {
                if ( group.id === action.payload.id){
                    return action.payload;
                }
                return group;
            });
            return {
                ...state,
                userGroups: [...newGroups]
            };

        case "ADD_MEMBER":
            // add the accepted user to the group members
            newGroups = state.userGroups.map(group => {
                if (group.id === action.payload.group) {
                    group.members.push(action.payload.member)
                    return group;
                }
                return group;
            });
            return {
                ...state,
                userGroups: [...newGroups]
            };

        case "CHANGE_MEMBERSHIP":
            // change the memberchip of this group
            newGroups = state.groups.map(group => {
                if (group.id === action.payload) {
                    group.membership = "sent" 
                    return group;
                }
                return group;
            });
            return {
                ...state,
                groups: [...newGroups]
            };

        case "SELECT_FRIEND":
            // make all the selected Group 
            // messages as has been read
            newGroups = state.userGroups.map(group => {
                if (group.id === action.payload.id) {
                    group.unReadMessages = 0;
                }
                return group
            })
            return {
                ...state,
                userGroups: [...newGroups]
            }; 

        case "RECIEVE_MESSAGE":
            // whene the user receiver a message from this group
            // and the selected one is not this group
            // increamen the unread messages for this group
            newGroups = state.userGroups.map(group => {
                if (group.id === action.payload) {
                    group.unReadMessages++;
                }
                return group
            })
            return {
                ...state,
                userGroups: [...newGroups]
            }; 

        case "REJECT_REQUEST":
            newGroups = state.groups.map(group => {
                if (group.id === action.payload) {
                    group.membership = "stranger";
                }
                return group
            })
            return {
                ...state,
                groups: [...newGroups]
            };

        default:
            return state
    }
} 
