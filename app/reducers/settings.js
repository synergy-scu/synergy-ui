import Actions from '../actions';
import TabPanes from '../components/settings/TabPanes';

const TabIndicies = TabPanes.reduce((accumulator, tab, idx) => {
    accumulator[tab.entity] = idx;
    return accumulator;
}, {});

export const settingsTab = (state = 1, action) => {
    switch (action.type) {
        case Actions.CHANGE_TAB:
            if (action.payload.tabIndex > 0 && action.payload.tabIndex < 4) {
                return action.payload.tabIndex;
            }
            return state;
        case Actions.SELECT_SEARCH: {
            const index = TabIndicies[action.payload.entity];
            if (index >= 0) {
                return index;
            }
            return state;
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
