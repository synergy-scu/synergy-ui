import Actions from '../actions';

export const chartsTab = (state = 1, action) => {
    switch (action.type) {
        case Actions.CHANGE_CHART_TAB:
            return action.payload.tabIndex;
        default:
            return state;
    }
};
