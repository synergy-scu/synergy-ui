import uuidv4 from 'uuid/v4';

import Actions from './types';
import { ExtendedChartOptions, ExtendedUsageOptions } from '../api/constants/ChartTypes';
import { fetchEntity } from './entities';

export const createChartStart = variables => {
    return {
        type: Actions.CREATE_CHART_START,
        payload: {
            requestID: uuidv4(),
            ...variables,
        },
    };
};

export const createChartSuccess = (requestID, chartID, variables) => {
    return {
        type: Actions.CREATE_CHART_SUCCESS,
        payload: {
            requestID,
            chartID,
            ...variables,
        },
    };
};

export const createChartError = (requestID, variables, error) => {
    return {
        type: Actions.CREATE_CHART_ERROR,
        payload: {
            requestID,
            ...variables,
            error,
        },
        error: true,
    };
};

export const createChart = ({ axios, menuType, name, members, chartType, usageType, options }) => dispatch => {
    const actionVariables = {
        name,
        members,
        chartType,
        usageType,
        options,
    };

    const newCreateChartAction = createChartStart(actionVariables);
    const requestID = newCreateChartAction.payload.requestID;
    dispatch(newCreateChartAction);

    let isResolved = false;
    setTimeout(() => {
        if (!isResolved) {
            dispatch(createChartError({
                requestID,
                variables: actionVariables,
                error: 'Unable to create chart. Request Timed Out',
            }));
        }
    }, 30 * 1000);

    const postVariables = {
        name,
        members: [...members.entries()].map(([uuid, type]) => {
            return { uuid, type };
        }),
        chartType: ExtendedChartOptions[chartType].verbiage.name,
        usageType: ExtendedUsageOptions[usageType].verbiage.name,
    };

    if (Object.keys(options).length) {

        postVariables.options = JSON.stringify(options);
    }

    return axios.post('chart/create', { variables: postVariables })
        .then(response =>
            response.status === 201
                ? response.data
                : Promise.reject(response.error)
        ).then(data => {
            console.log(data);
            isResolved = true;
            dispatch(createChartSuccess({
                requestID,
                chartID: data.id,
                variables: actionVariables,
            }));
            dispatch(fetchEntity({
                axios,
                parentRequestType: menuType,
                entityType: 'chart',
                uuid: data.id,
                usageType,
            }));
        }).catch(error => {
            isResolved = true;
            console.error(error);
            dispatch(createChartError({
                requestID,
                variables: actionVariables,
                error,
            }));
        });
};

export const toggleCumulative = (type, isEnabled) => {
    return {
        type: Actions.TOGGLE_CUMULATIVE,
        payload: {
            isEnabled,
        },
        meta: {
            type,
        },
    };
};

export const updateCumulativeChart = (type, chart) => {
    return {
        type: Actions.UPDATE_CUMULATIVE_CHART,
        payload: {
            chart,
        },
        meta: {
            type,
        },
    };
};
