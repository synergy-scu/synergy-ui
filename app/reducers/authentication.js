import Actions from '../actions';
import ErrorTypes from '../api/constants/ErrorTypes';

export const isLoginModalOpen = (state = false, action) => {
    switch (action.type) {
        case Actions.TOGGLE_LOGIN_MODAL:
            if (typeof action.payload.isOpen !== 'boolean') {
                return !state;
            }
            return action.payload.isOpen;
        case Actions.LOGIN_SUCCESS:
            return false;
        default:
            return state;
    }
};

export const isNewUserModalOpen = (state = false, action) => {
    switch (action.type) {
        case Actions.TOGGLE_NEW_USER_MODAL:
            if (typeof action.payload.isOpen !== 'boolean') {
                return !state;
            }
            return action.payload.isOpen;
        default:
            return state;
    }
};

export const userHandlerErrors = (state = '', action) => {
    switch (action.type) {
        case Actions.LOGIN_START:
            return '';
        case Actions.LOGIN_ERROR:
            if (action.payload.altMessage.length) {
                return action.payload.altMessage;
            } else if (action.payload.type !== ErrorTypes.UNKNOWN.type && ErrorTypes.hasOwnProperty(action.payload.type)) {
                return ErrorTypes[action.payload.type].altMessage;
            } else if (action.payload.message.length) {
                return action.payload.message;
            } else if (action.payload.hasOwnProperty('error')) {
                return action.payload.error;
            }
            return ErrorTypes.UNKNOWN.altMessage;
        default:
            return state;
    }
};
