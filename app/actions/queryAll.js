import uuidv4 from 'uuid/v4';

import Actions from './types';
import { capitalize } from '../api/utils';
import AXIOS_TIMEOUT from '../api/constants/AxiosTimeout';
import { updateCumulativeChart, toggleCumulative } from './charts';
import { getCumulativeChart, fetchChart } from '../api/charts';
import { UsageTypes } from '../api/constants/ChartTypes';
import { normalize } from '../api/normalize/normalize';
import { requestStream } from './usage';
import { extractGroupedMembers, getChannelsFromGroup } from '../api/socket/usageUtils';

export const fetchAllNew = () => {
    return {
        type: Actions.FETCH_ALL_NEW,
        payload: {
            requestID: uuidv4(),
        },
    };
};

export const fetchAllStart = ({ requestID, entityType }) => {
    return {
        type: Actions.FETCH_ALL_START,
        payload: {
            requestID,
            entityType,
        },
    };
};

export const fetchAllSuccess = ({ requestID, entityType, data }) => {
    return {
        type: Actions.FETCH_ALL_SUCCESS,
        payload: {
            requestID,
            entityType,
            data,
        },
    };
};

export const fetchAllError = ({ requestID, entityType, error }) => {
    return {
        type: Actions.FETCH_ALL_ERROR,
        payload: {
            requestID,
            entityType,
            error,
        },
    };
};

export const fetchAllFinish = ({ requestID }) => {
    return {
        type: Actions.FETCH_ALL_FINISH,
        payload: {
            requestID,
        },
    };
};

export const fetchAll = ({ axios }) => dispatch => {
    const routes = ['group', 'device', 'channel', 'chart', 'reminder'];

    const newFetchAll = fetchAllNew();
    const id = newFetchAll.payload.requestID;
    dispatch(newFetchAll);

    const promises = routes.map(route => {
        const entityType = `${route}s`;

        let isResolved = false;
        dispatch(fetchAllStart({ requestID: id, entityType }));

        setTimeout(() => {
            if (!isResolved) {
                dispatch(fetchAllError({
                    requestID: id,
                    entityType,
                    error: `${capitalize(entityType)} query timed out`,
                }));
            }
        }, AXIOS_TIMEOUT);

        return axios.post(route, {})
            .then(response => response.data
                ? response.data
                : Promise.reject(response))
            .then(data => {
                isResolved = true;
                dispatch(fetchAllSuccess({
                    requestID: id,
                    entityType,
                    data,
                }));

                if (route === 'channel') {
                    const members = [];
                    const normalizedChannels = new Map(data.map(channel => {
                        const normalizedChannel = normalize(channel, 'channels');
                        members.push({
                            uuid: normalizedChannel.key,
                            type: channel,
                            channels: new Set([normalizedChannel.uuid]),
                        });
                        return [normalizedChannel.key, normalizedChannel];
                    }));

                    const chart = getCumulativeChart(uuidv4(), UsageTypes.REALTIME, normalizedChannels);

                    dispatch(updateCumulativeChart(UsageTypes.REALTIME, chart));
                    dispatch(toggleCumulative(UsageTypes.REALTIME, true));
                    dispatch(requestStream({
                        axios,
                        chartID: chart.uuid,
                        chartMeta: {
                            chartType: chart.chartType,
                            usageType: chart.usageType,
                            ...chart.options,
                        },
                        variables: {},
                        members,
                        channels: [...getChannelsFromGroup(members).values()],

                    }));
                }
            }).catch(error => {
                isResolved = true;
                console.error(error);
                dispatch(fetchAllError({
                    requestID: id,
                    entityType,
                    error,
                }));
            });
    });

    Promise.all(promises).then(() => {
        dispatch(fetchAllFinish({ requestID: id }));
    });
};
