import uuidv4 from 'uuid/v4';

import Actions from './types';
import { streamUsage } from './stream';
import { validResponse, invalidRespone } from '../api/requests';
import AXIOS_TIMEOUT from '../api/constants/AxiosTimeout';

export const initializeUsage = ({ chartID, chartMeta, ...props }) => {
    return {
        type: Actions.INITIALIZE_USAGE,
        payload: {
            chartID,
            chartMeta,
            ...props,
        },
    };
};

export const usageStart = ({ chartID, chartMeta, variables }) => {
    return {
        type: Actions.USAGE_START,
        payload: {
            requestID: uuidv4(),
            chartID,
            chartMeta,
            variables,
        },
    };
};

export const usageSuccess = ({ requestID, streamID, chartID, chartMeta, data, ...props }) => {
    return {
        type: Actions.USAGE_SUCCESS,
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

export const usageError = ({ requestID, streamID = null, chartID, chartMeta, variables, error, ...props }) => {
    return {
        type: Actions.USAGE_ERROR,
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

export const usageEnd = ({ requestID, streamID, chartID, chartMeta, ...props }) => {
    return {
        type: Actions.USAGE_END,
        payload: {
            requestID,
            streamID,
            chartID,
            chartMeta,
            ...props,
        },
    };
};

export const requestStream = ({ axios, chartID, chartMeta, variables, channels, members }) => dispatch => {
    const newUsageRequest = usageStart({ chartMeta, variables });
    const requestID = newUsageRequest.payload.requestID;
    dispatch(newUsageRequest);

    let isResolved = false;
    setTimeout(() => {
        if (!isResolved) {
            dispatch(usageError({
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
            console.log(error);
            isResolved = true;
            // dispatch(usageError({ requestID, chartMeta, variables, error }));
        });
};


