import uuidv4 from 'uuid/v4';

import Actions from './types';
import { streamUsage } from './stream';
import AXIOS_TIMEOUT from '../api/constants/AxiosTimeout';

export const usageStreamStart = ({ chartID, chartMeta, variables }) => {
    return {
        type: Actions.USAGE_STREAM_START,
        payload: {
            requestID: uuidv4(),
            chartID,
            chartMeta,
            variables,
        },
    };
};

export const usageStreamSuccess = ({ requestID, streamID, chartID, chartMeta, data, ...props }) => {
    return {
        type: Actions.USAGE_STREAM_SUCCESS,
        payload: {
            requestID,
            streamID,
            chartID,
            chartMeta,
            data,
            ...props,
        },
    };
};

export const usageStreamError = ({ requestID, streamID = null, chartID, chartMeta, variables, error, ...props }) => {
    return {
        type: Actions.USAGE_STREAM_ERROR,
        payload: {
            requestID,
            streamID,
            chartID,
            chartMeta,
            variables,
            error,
            ...props,
        },
    };
};

export const requestStream = ({ axios, chartID, chartMeta, variables, channels, members }) => dispatch => {
    const newUsageRequest = usageStreamStart({ chartMeta, variables });
    const requestID = newUsageRequest.payload.requestID;
    dispatch(newUsageRequest);

    let isResolved = false;
    setTimeout(() => {
        if (!isResolved) {
            dispatch(usageStreamError({
                requestID,
                chartID,
                chartMeta,
                variables,
                error: 'Usage stream request timed out',
            }));
        }
    }, AXIOS_TIMEOUT);

    axios.post('usage/stream', { chartID, variables, channels, refreshRate: 600 })
        .then(response =>
            response.status === 200 && response.data
                ? response.data
                : Promise.reject(response.error)

        ).then(data => {
            isResolved = true;
            dispatch(streamUsage({
                streamID: data.streamID,
                chartID,
                chartMeta,
                channels,
                members,
            }));
        }).catch(error => {
            console.error(error);
            isResolved = true;
            // dispatch(usageStreamError({ requestID, chartMeta, variables, error }));
        });
};


export const usageStart = ({ chartID, chartMeta, variables, channels, members }) => {
    return {
        type: Actions.USAGE_START,
        payload: {
            requestID: uuidv4(),
            chartID,
            chartMeta,
            variables,
            channels,
            members,
        },
    };
};

export const usageSuccess = ({ requestID, chartID, data, reverseLookup, ...props }) => {
    return {
        type: Actions.USAGE_SUCCESS,
        payload: {
            requestID,
            chartID,
            data,
            reverseLookup,
            ...props,
        },
    };
};

export const usageError = ({ requestID, chartID, error, ...props }) => {
    return {
        type: Actions.USAGE_ERROR,
        payload: {
            requestID,
            chartID,
            error,
            ...props,
        },
    };
};

export const requestHistory = ({ axios, chartID, chartMeta, variables, channels, members }) => dispatch => {
    const reverseLookup = new Map();
    members.forEach(member => {
        member.channels.forEach(channel => reverseLookup.set(channel, member.uuid));
    });

    const newUsageAction = usageStart({ chartID, chartMeta, variables, channels, members });
    const requestID = newUsageAction.payload.requestID;
    dispatch(newUsageAction);

    let isResolved = false;
    setTimeout(() => {
        if (!isResolved) {
            dispatch(usageError({
                requestID,
                chartID,
                error: 'Usage request timed out',
            }));
        }
    }, AXIOS_TIMEOUT);

    axios.post('usage/history', { chartID, variables, channels })
        .then(response =>
            response.status === 200 && response.data
                ? response.data
                : Promise.reject(response.error)
        ).then(data => {
            isResolved = true;
            dispatch(usageSuccess({
                requestID,
                chartID,
                data,
                reverseLookup,
            }));
        }).catch(error => {
            console.error(error);
            isResolved = true;
            dispatch(usageError({
                requestID,
                chartID,
                error,
            }));
        });
};
