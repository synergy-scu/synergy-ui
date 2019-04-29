import Actions from '../actions';

export const chartsTab = (state = 'view', action) => {
    switch (action.type) {
        case Actions.CHANGE_CHART_TAB:
            return action.payload.tab;
        default:
            return state;
    }
};

export const isSidebarOpen = (state = false, action) => {
    switch (action.type) {
        case Actions.SET_SIDEBAR_VISIBILITY:
            return action.payload.isVisible;
        default:
            return state;
    }
};
