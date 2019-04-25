import uuidv4 from 'uuid/v4';

import Actions from './types';
import { capitalize } from '../api/utils';
import AXIOS_TIMEOUT from '../api/constants/AxiosTimeout';

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
    const routes = ['group', 'device', 'channel', 'chart'];

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
            }).catch(error => {
                isResolved = true;
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
