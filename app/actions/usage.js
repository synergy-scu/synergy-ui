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

export const fetchUsage = ({ axios, chartID, usageType = 'all', chartType, timeRange = {}, limit = 1 }) => dispatch => {
    const newUsageRequest = usageStart({ chartID, usageType, chartType, timeRange });
    const id = newUsageRequest.payload.requestID;
    dispatch(newUsageRequest);

    if (!Object.keys(timeRange).length) {
        timeRange.after = new Date().getTime() - 1000 - 7 * 60 * 60 * 100;
    }

    timeRange.limit = limit;

    let isResolved = false;
    setTimeout(() => {
        if (!isResolved) {
            dispatch(usageError({
                requestID: id,
                chartID,
                usageType,
                chartType,
                error: 'Failed to fetch usage data: Request timed out',
            }));
        }
    }, AXIOS_TIMEOUT);

    axios.post('usage', timeRange)
        .then(response => {
            if (validResponse(response)) {
                return response.data.payload;
            } else if (invalidRespone(response)) {
                return Promise.reject(new Error('An error occured getting the next data set for the requested chart'.concat(' | ', response.errors.error)));
            }
            return Promise.reject(new Error('An error occured getting the next data set for the requested chart'));
        }).then(data => {
            isResolved = true;
            dispatch(usageSuccess({
                requestID: id,
                chartID,
                usageType,
                chartType,
                data,
            }));
        }).catch(error => {
            console.warn(error);
            isResolved = true;
            dispatch(usageError({
                requestID: id,
                chartID,
                usageType,
                chartType,
                error,
            }));
        });
};



export const requestStream = ({ axios, chartID, chartMeta, variables, channels }) => dispatch => {
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
            }));
        }).catch(error => {
            console.log(error);
            isResolved = true;
            // dispatch(usageError({ requestID, chartMeta, variables, error }));
        });
};


