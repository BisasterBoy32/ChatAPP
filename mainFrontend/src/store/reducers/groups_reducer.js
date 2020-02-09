export const initGroupsValue = {
    groups : [],
    userGroups : []
}

export const groupsReducer = (state, action) => {
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

        default:
            return state
    }
} 