import { get } from 'lodash';

import Actions from '../actions';

const chartsTab = type => (state = 'view', action) => {
    if (get(action, 'meta.type', '') !== type) {
        if (action.type === Actions.FETCH_ENTITY_SUCCESS && action.payload.entityType === 'charts' && action.payload.usageType === type) {
            return 'view';
        }
        return state;
    }

    switch (action.type) {
        case Actions.CHANGE_CHART_TAB:
            return action.payload.tab;
        case Actions.CHANGE_CHART:
            return 'view';
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
        case Actions.CHANGE_CHART:
            return false;
        default:
            return state;
    }
};

const selectedChart = type => (state = '', action) => {
    if (get(action, 'meta.type', '') !== type) {
        if (action.type === Actions.FETCH_ENTITY_SUCCESS && action.payload.entityType === 'charts' && action.payload.usageType === type) {
            return action.payload.uuid;
        }
        return state;
    }

    switch (action.type) {
        case Actions.CHANGE_CHART:
            return action.payload.chart;
        default:
            return state;
    }
};

export default type => {
    return {
        chartsTab: chartsTab(type),
        isSidebarOpen: isSidebarOpen(type),
        selectedChart: selectedChart(type),
    };
};
