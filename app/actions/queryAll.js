import uuidv4 from 'uuid/v4';

import Actions from './types';

const FETCH_ALL_TIMEOUT = 30 * 1000; // 30 seconds

export const validResponse = response => response.status === 200 && response.hasOwnProperty('data') && response.data.hasOwnProperty('payload') && response.data.valid;

export const fetchAllNew = () => {
    return {
        type: Actions.FETCH_ALL_NEW,
        payload: {
            requestID: uuidv4(),
        },
    };
};

export const fetchAllNewEntity = ({ requestID, entityType }) => {
    return {
        type: Actions.FETCH_ALL_NEW_ENTITY,
        payload: {
            requestID,
            entityType,
        },
    };
};

export const fetchAllStart = ({ requestID, entityType, limit, offset }) => {
    return {
        type: Actions.FETCH_ALL_START,
        payload: {
            requestID,
            entityType,
            limit,
            offset,
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

export const fetchAllFinish = ({ requestID, entityType }) => {
    return {
        type: Actions.FETCH_ALL_FINISH,
        payload: {
            requestID,
            entityType,
        },
    };
};

export const fetchAll = ({ axios, limit }) => dispatch => {
    const newFetchAll = fetchAllNew();
    const id = newFetchAll.payload.requestID;
    dispatch(newFetchAll);

    axios.post('count', {
        type: 'all',
    }).then(response =>
        validResponse(response)
            ? response.data.payload
            : Promise.reject(new Error('An error occured getting the total number of entities. This is a fatal error'))
    ).then(counts => {
        Object.entries(counts).forEach(([ entity, count ]) => {

            const requests = Math.ceil(count / limit);

            const promises = new Array(requests).fill(0).map((item, idx) => {
                const offset = idx * limit;

                dispatch(fetchAllStart({
                    requestID: id,
                    entityType: entity,
                    limit,
                    offset,
                }));

                let isResolved = false;
                setTimeout(() => {
                    if (!isResolved) {
                        dispatch(fetchAllError({
                            requestID: id,
                            error: `Failed to fetch all ${entity}: Request timed out`,
                            entityType: entity,
                        }));
                    }
                }, FETCH_ALL_TIMEOUT);

                return axios.post(entity.substring(0, entity.length - 1), {
                    type: 'multiplex',
                    payload: {
                        count: limit,
                        offset,
                    },
                }).then(response =>
                    validResponse(response)
                        ? response.data
                        : Promise.reject(new Error(
                            `An error occured executing the fetch request for ${entity}`,
                        ))
                ).then(data => {
                    isResolved = true;
                    dispatch(fetchAllSuccess({
                        requestID: id,
                        data: data.payload,
                        entityType: entity,
                    }));
                }).catch(error => {
                    isResolved = true;
                    console.warn(error);
                    dispatch(fetchAllError({
                        requestID: id,
                        error,
                        entityType: entity,
                    }));
                });
            });

            Promise.all(promises).then(() => {
                dispatch(fetchAllFinish({
                    requestID: id,
                    entityType: entity,
                }));
            });
        });
    }).catch(error => {
        console.error(error);
    });
};
