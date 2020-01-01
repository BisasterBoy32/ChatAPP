export const alertInitValue = {
    type: "",
    msg: ""
};

export const alertReducer = (state, action) => {
    switch (action.type) {
        case "INFO_ERRO":
            return {
                ...state,
                type: "error",
                msg: action.payload
            }
        case "INFO_SUCCESS":
            return {
                ...state,
                type: "success",
                msg: action.payload
            }
        case "CLOSE_ALERT":
            return {
                ...state,
                msg: ""
            }
        default:
            return state;
    }
}