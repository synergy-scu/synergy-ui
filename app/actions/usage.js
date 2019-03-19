import uuidv4 from 'uuid/v4';

import Actions from './types';
import { validResponse, invalidRespone } from '../api/requests';

export const initializeUsage = ({ usageType, chartType, ...props }) => {
    return {
        type: Actions.INITIALIZE_USAGE,
        payload: {
            usageType,
            chartType,
            ...props,
        },
    };
};

export const usageStart = ({ chartID, usageType, chartType, timeRange }) => {
    return {
        type: Actions.USAGE_START,
        payload: {
            requestID: uuidv4(),
            chartID,
            usageType,
            chartType,
            timeRange,
        },
    };
};

export const usageSuccess = ({ requestID, chartID, usageType, chartType, data, ...props }) => {
    return {
        type: Actions.USAGE_SUCCESS,
        payload: {
            requestID,
            chartID,
            usageType,
            chartType,
            data,
            ...props,
        },
    };
};

export const usageError = ({ requestID, chartID, usageType, chartType, error, ...props }) => {
    return {
        type: Actions.USAGE_ERROR,
        payload: {
            requestID,
            chartID,
            usageType,
            chartType,
            error,
            ...props,
        },
    };
};

export const usageEnd = ({ chartID, usageType, chartType, isSuccess, ...props }) => {
    return {
        type: Actions.USAGE_END,
        payload: {
            chartID,
            usageType,
            chartType,
            isSuccess,
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
    }, 30 * 1000);

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

