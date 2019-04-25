import { default as Actions } from './types';

export const changeUser = user => {
    return {
        type: Actions.CHANGE_USER,
        payload: {
            user,
        },
    };
};

export const setUserID = userID => {
    return {
        type: Actions.SET_USER_ID,
        payload: {
            userID,
        },
    };
};

export const toggleLoginModal = (isOpen = null) => {
    return {
        type: Actions.TOGGLE_LOGIN_MODAL,
        payload: {
            isOpen,
        },
    };
};

export const toggleNewUserModal = (isOpen = null) => {
    return {
        type: Actions.TOGGLE_NEW_USER_MODAL,
        payload: {
            isOpen,
        },
    };
};
