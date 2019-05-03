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

export const setChart = (type, chartID, chartType) => {
    return {
        type: Actions.SET_CHART,
        payload: {
            chartID,
            chartType,
        },
        meta: {
            type,
        },
    };
};

export const setChartType = (type, chartType) => {
    return {
        type: Actions.SET_CHART_TYPE,
        payload: {
            chartType,
        },
        meta: {
            type,
        },
    };
};

