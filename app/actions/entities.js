import uuidv4 from 'uuid/v4';

import Actions from './types';

export const extractChannels = (entityType, uuid, data) => {
    return {
        type: Actions.EXTRACT_CHANNELS,
        payload: {
            entityType,
            uuid,
            data,
        },
    };
};

export const extractAllChannels = () => {
    return {
        type: Actions.EXTRACT_ALL_CHANNELS,
    };
};

export const fetchEntityStart = ({ entityType, uuid }) => {
    return {
        type: Actions.FETCH_ENTITY_START,
        payload: {
            requestID: uuidv4(),
            entityType,
            uuid,
        },
    };
};

export const fetchEntitySuccess = ({ requestID, entityType, uuid, data }) => {
    return {
        type: Actions.FETCH_ENTITY_SUCCESS,
        payload: {
            requestID,
            entityType,
            uuid,
            data,
        },
    };
};

export const fetchEntityError = ({ requestID, entityType, uuid, error }) => {
    return {
        type: Actions.FETCH_ENTITY_ERROR,
        payload: {
            requestID,
            entityType,
            uuid,
            error,
        },
        error: true,
    };
};

export const fetchEntity = ({ axios, entityType, uuid }) => dispatch => {
    const plural = `${entityType}s`;

    const newFetchRequest = fetchEntityStart({ entityType, uuid });
    const requestID = newFetchRequest.payload.requestID;
    dispatch(newFetchRequest);

    let isResolved = false;
    setTimeout(() => {
        if (!isResolved) {
            dispatch(fetchEntityError({
                requestID,
                entityType: plural,
                uuid,
                error: `Unable to fetch ${entityType}. Request timed out`,
            }));
        }
    }, 30 * 1000);

    const route = `${entityType}/get`;
    axios.post(route, {
        [`${entityType}ID`]: uuid,
    }).then(response =>
        response.status === 200 && response.data
            ? response.data
            : Promise.reject('Bleh')
    ).then(data => {
        isResolved = true;
        dispatch(fetchEntitySuccess({
            requestID,
            entityType: plural,
            uuid,
            data,
        }));
        // console.log(data);
        return data;
    }).then(data => {
        dispatch(extractChannels(plural, uuid, data));
    }).catch(error => {
        isResolved = true;
        dispatch(fetchEntityError({
            requestID,
            entityType: plural,
            uuid,
            error,
        }));
        console.log(error);
    });
};
