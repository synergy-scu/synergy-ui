import uuidv4 from 'uuid/v4';

import Actions from './types';
import { validResponse, invalidRespone } from '../api/requests';
import AXIOS_TIMEOUT from '../api/constants/AxiosTimeout';
import { fetchEntity } from './entities';

export const createGroupStart = (name, members) => {
    return {
        type: Actions.CREATE_GROUP_START,
        payload: {
            requestID: uuidv4(),
            name,
            members,
        },
    };
};

export const createGroupSuccess = ({ requestID, groupID, data }) => {
    return {
        type: Actions.CREATE_GROUP_SUCCESS,
        payload: {
            requestID,
            groupID,
            data,
        },
    };
};

export const createGroupError = ({ requestID, name, members, error }) => {
    return {
        type: Actions.CREATE_GROUP_ERROR,
        payload: {
            requestID,
            name,
            members,
            error,
        },
    };
};

export const createGroup = ({ axios, name, members }) => dispatch => {
    const newCreateGroupRequest = createGroupStart(name, members);
    const requestID = newCreateGroupRequest.payload.requestID;
    dispatch(newCreateGroupRequest);

    let isResolved = false;
    setTimeout(() => {
        if (!isResolved) {
            dispatch(createGroupError({
                requestID,
                name,
                members,
                error: new Error('Unable to create group. Request timed out.'),
            }));
        }
    }, AXIOS_TIMEOUT);

    axios.post('group/create', {
        variables: {
            name,
            members: [...members.entries()].map(([uuid, type]) => {
                return {
                    type,
                    uuid,
                };
            }),
        },
    }).then(response =>
        response.status === 201
            ? response.data
            : Promise.reject(response.error)

    ).then(data => {
        console.log(data);
        isResolved = true;
        dispatch(createGroupSuccess({
            requestID,
            groupID: data.id,
        }));
        dispatch(fetchEntity({
            axios,
            entityType: 'group',
            uuid: data.id,
        }));
    }).catch(error => {
        isResolved = true;
        dispatch(createGroupError({
            requestID,
            name,
            members,
            error,
        }));
        console.error(error);
    });
};
