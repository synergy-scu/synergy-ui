import { Actions } from '../actions';

export const user = (state = '', action) => {
    switch (action.type) {
        case Actions.CHANGE_USER:
            return action.payload.user;
        default:
            return state;
    }
};
