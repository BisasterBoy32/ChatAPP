export const initNotificationValue = []
export const notificationReducer = (state ,action) => {
    let newNotifications;

    switch (action.type){
        case "LOAD_NOTIFICATIONS":
            return [...state ,...action.payload];
        
        case "DELETE_NOTIFICATION":
            newNotifications = state.filter(notification =>  notification.id !== action.payload)
            return newNotifications;
    }
}