import Actions from '../actions';

export const settingsTab = (state = 'group', action) => {
    switch (action.type) {
        case Actions.CHANGE_SETTINGS_TAB:
            return action.payload.tabIndex;
        case Actions.SELECT_SEARCH: {
            return action.payload.entity;
        }
        default:
            return state;
    }
};

export const activeGroup = (state = '', action) => {
    switch (action.type) {
        case Actions.CHANGE_ACTIVE_GROUP:
            return action.payload.groupID;
        case Actions.SELECT_SEARCH:
            if (action.payload.entity === 'group') {
                return action.payload.uuid;
            }
            return state;
        default:
            return state;
    }
};

export const activeDevice = (state = '', action) => {
    switch (action.type) {
        case Actions.CHANGE_ACTIVE_DEVICE:
            return action.payload.deviceID;
        case Actions.SELECT_SEARCH:
            if (action.payload.entity === 'device') {
                return action.payload.uuid;
            }
            return state;
        default:
            return state;
    }
};

export const activeChannel = (state = '', action) => {
    switch (action.type) {
        case Actions.CHANGE_ACTIVE_CHANNEL:
            return action.payload.channelID;
        case Actions.SELECT_SEARCH:
            if (action.payload.entity === 'channel') {
                return action.payload.uuid;
            }
            return state;
        default:
            return state;
    }
};

export const showEditModal = (state = false, action) => {
    switch (action.type) {
        case Actions.TOOGLE_EDIT_MODAL:
            return !state;
        default:
            return state;
    }
};

export const editTab = (state = 0, action) => {
    switch (action.type) {
        case Actions.TOOGLE_EDIT_MODAL:
            return 0;
        case Actions.CHANGE_EDIT_TAB:
            return action.payload.tabIndex;
        default:
            return state;
    }
};
