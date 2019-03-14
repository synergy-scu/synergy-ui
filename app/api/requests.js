import RequestStates from './constants/RequestStates';

export const fetchRequest = ({
    id = null,
    start = 0,
    end = 0,
    time = 0,
    count = 0,
    phase = RequestStates.INITIAL,
    type = null,
    ...params
}) => {
    return {
        id,
        start,
        end,
        time,
        count,
        phase,
        type,
        ...params,
    };
};

export const entityRequest = ({
    id = null,
    start = 0,
    end = 0,
    time = 0,
    requests = 0,
    total = 0,
    status = {},
    errors = [],
    phase = RequestStates.INITIAL,
    type = null,
    ...params
}) => {
    return {
        id,
        start,
        end,
        time,
        requests,
        total,
        status,
        errors,
        phase,
        type,
        ...params,
    };
};

export const fetchAllRequest = ({
    id = null,
    start = 0,
    end = 0,
    time = 0,
    requests = 0,
    status = {
        groups: entityRequest({}),
        devices: entityRequest({}),
        channels: entityRequest({}),
    },
    phase = RequestStates.INITIAL,
    ...params
}) => {
    return {
        id,
        start,
        end,
        time,
        requests,
        status,
        phase,
        ...params,
    };
};


