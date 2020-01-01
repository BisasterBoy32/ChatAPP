export const userInitState = {
    user: { username: "anonymouse" },
    loading: true,
    token: localStorage.getItem("token")

}

export const userReducer = (state, action) => {
    switch (action.type) {
        case "GET_USER":
            return {
                ...state,
                user: action.payload,
                token: localStorage.getItem("token"),
                loading: false,
            }

        case "LOGIN_STARTED":
            return {
                ...state,
                user: { username: "anonymouse" },
                loading: true,
            }

        case "UPDATE_USER":
            return {
                ...state,
                user: {
                    // update user info
                    ...state.user,
                    ...res,
                    profile: {
                        // update profile info
                        ...state.user.profile,
                        ...res.profile
                    }
                },
            }

        case "LOGOUT":
            localStorage.setItem("token", "");
            return {
                user: { username: "anonymouse" },
                loading: false,
                token: localStorage.getItem("token")
            };

        case "LOGOUT_FAILED":
            console.log(action.payload)
            return state

        case "LOGIN_FAILED":
            console.log(action.payload)
            return {
                user: { username: "anonymouse" },
                loading: false,
                token: localStorage.getItem("token")
            };

        default:
            return state;

    }
}