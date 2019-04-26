import Actions from './types';

export const changeChartTab = tabIndex => {
    return {
        type: Actions.CHANGE_CHART_TAB,
        payload: {
            tabIndex,
        },
    };
};
