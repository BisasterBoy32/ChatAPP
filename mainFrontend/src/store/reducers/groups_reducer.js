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
                groups : [
                    ...state.groups ,
                    ...action.payload
                ]
            };

        case "LOAD_USER_GROUPS":
            return {
                ...state,
                userGroups: [
                    ...state.userGroups,
                    ...action.payload
                ]
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
            })
            return {
                ...state,
                userGroups: [...newGroups]
            };
        default:
            return state
    }
} 
