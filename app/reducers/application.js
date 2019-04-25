import Actions from '../actions';

export const user = (state = {}, action) => {
    switch (action.type) {
        case Actions.CHANGE_USER:
            return action.payload.user;
        case Actions.LOGIN_SUCCESS:
            return action.payload.user;
        case Actions.LOGIN_ERROR:
            return {};
        default:
            return state;
    }
};

export const userID = (state = -1, action) => {
    switch (action.type) {
        case Actions.SET_USER_ID:
            return action.payload.userID;
        case Actions.LOGIN_SUCCESS:
            return action.payload.user.userID;
        case Actions.LOGIN_ERROR:
            return -1;
        default:
            return state;
    }
};
