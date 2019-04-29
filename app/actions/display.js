import Actions from './types';

export const changeChartTab = tab => {
    return {
        type: Actions.CHANGE_CHART_TAB,
        payload: {
            tab,
        },
    };
};

export const setSidebarVisibility = isVisible => {
    return {
        type: Actions.SET_SIDEBAR_VISIBILITY,
        payload: {
            isVisible,
        },
    };
};
