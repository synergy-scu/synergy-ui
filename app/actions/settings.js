import Actions from './types';

export const selectSearch = ({ entity, uuid }) => {
    return {
        type: Actions.SELECT_SEARCH,
        payload: {
            entity,
            uuid,
        },
    };
};

export const changeSettingsTab = tabIndex => {
    return {
        type: Actions.CHANGE_SETTINGS_TAB,
        payload: {
            tabIndex,
        },
    };
};

export const changeActiveGroup = groupID => {
    return {
        type: Actions.CHANGE_ACTIVE_GROUP,
        payload: {
            groupID,
        },
    };
};

export const changeActiveDevice = deviceID => {
    return {
        type: Actions.CHANGE_ACTIVE_DEVICE,
        payload: {
            deviceID,
        },
    };
};

export const changeActiveChannel = channelID => {
    return {
        type: Actions.CHANGE_ACTIVE_CHANNEL,
        payload: {
            channelID,
        },
    };
};

export const toggleEditModal = () => {
    return {
        type: Actions.TOOGLE_EDIT_MODAL,
    };
};

export const changeEditTab = tabIndex => {
    return {
        type: Actions.CHANGE_EDIT_TAB,
        payload: {
            tabIndex,
        },
    };
};
