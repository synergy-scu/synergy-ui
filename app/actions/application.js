import { default as Actions } from './types';

export const changeUser = user => {
    return {
        type: Actions.CHANGE_USER,
        payload: {
            user,
        },
    };
};
