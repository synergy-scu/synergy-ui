import { get } from 'lodash';

import Actions from '../actions';

const chartsTab = type => (state = 'view', action) => {
    if (get(action, 'meta.type', '') !== type) {
        return state;
    }

    switch (action.type) {
        case Actions.CHANGE_CHART_TAB:
            return action.payload.tab;
        default:
            return state;
    }
};

const isSidebarOpen = type => (state = false, action) => {
    if (get(action, 'meta.type', '') !== type) {
        return state;
    }

    switch (action.type) {
        case Actions.SET_SIDEBAR_VISIBILITY:
            return action.payload.isVisible;
        default:
            return state;
    }
};

export default type => {
    return {
        chartsTab: chartsTab(type),
        isSidebarOpen: isSidebarOpen(type),
    };
};
