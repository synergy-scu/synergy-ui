import moment from 'moment';

import Actions from '../actions';

const RequestStates = {
    INITIAL: Symbol('INITIAL'),
    LOADING: Symbol('LOADING'),
    SUCCESS: Symbol('SUCCESS'),
    ERRORED: Symbol('ERRORED'),
    FINISHED: Symbol('FINISHED'),
};
const request = ({ id = '', start = 0, end = 0, duration = 0, phase = RequestStates.INITIAL }) => {
    return {
        id,
        start,
        end,
        duration,
        phase,
    };
};

export const loginRequest = (state = request({}), action) => {
    const now = moment();
    switch (action.type) {
        case Actions.LOGIN_START:
            return request({
                id: action.payload.requestID,
                start: now,
                phase: RequestStates.LOADING,
            });
        case Actions.LOGIN_SUCCESS:
            return request({
                ...state,
                end: now,
                duration: `${now.valueOf() - state.start.valueOf()}ms`,
                phase: RequestStates.SUCCESS,
            });
        case Actions.LOGIN_ERROR:
            return request({
                ...state,
                end: now,
                duration: `${now.valueOf() - state.start.valueOf()}ms`,
                phase: RequestStates.ERRORED,
            });
        default:
            return state;
    }
};

export const historyRequest = (state = RequestStates.INITIAL, action) => {
    switch (action.type) {
        case Actions.USAGE_START:
            return RequestStates.LOADING;
        case Actions.USAGE_SUCCESS:
            return RequestStates.SUCCESS;
        case Actions.USAGE_ERROR:
            return RequestStates.ERRORED;
        default:
            return state;
    }
};
