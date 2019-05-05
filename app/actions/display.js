import Actions from './types';

export const changeChartTab = (type, tab) => {
    return {
        type: Actions.CHANGE_CHART_TAB,
        payload: {
            tab,
        },
        meta: {
            type,
        },
    };
};

export const setSidebarVisibility = (type, isVisible) => {
    return {
        type: Actions.SET_SIDEBAR_VISIBILITY,
        payload: {
            isVisible,
        },
        meta: {
            type,
        },
    };
};

export const changeChart = (type, chart) => {
    return {
        type: Actions.CHANGE_CHART,
        payload: {
            chart,
        },
        meta: {
            type,
        },
    };
};
