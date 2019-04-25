import { saveState } from '../localStorage';

export const subscribeToStore = store => {
    const state = store.getState();

    saveState({
        userID: state.userID,
    });
};
