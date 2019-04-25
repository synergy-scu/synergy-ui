import uuidv4 from 'uuid/v4';

import Actions from './types';
import { validResponse, invalidRespone } from '../api/requests';
import AXIOS_TIMEOUT from '../api/constants/AxiosTimeout';

export const createGroupStart = () => {
    return {
        type: Actions.CREATE_GROUP_START,
        payload: {
            requestID: uuidv4(),
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
    const newCreateGroupRequest = createGroupStart();
    const id = newCreateGroupRequest.payload.id;
    dispatch(newCreateGroupRequest);

    let isResolved = false;
    setTimeout(() => {
        if (!isResolved) {
            dispatch(createGroupError({
                requestID: id,
                name,
                members,
                error: new Error('Unable to create group. Request timed out.'),
            }));
        }
    }, AXIOS_TIMEOUT);

    axios.post('group', {
        type: 'create',
        payload: {
            name,
            members: [...members.entries()].map(([uuid, type]) => {
                return {
                    type,
                    uuid,
                };
            }),
        },
    }).then(response => {
        if (validResponse(response)) {
            return response.data;
        } else if (invalidRespone(response)) {
            return response.data.errors || new Error('An error occured creating a new group');
        }
        return new Error('An error occured communicating with Synergy Hub');

    }).then(data => {
        isResolved = true;
        dispatch(createGroupSuccess({
            requestID: id,
            groupID: data.payload.groupID,
            data: data.payload,
        }));
    }).catch(error => {
        isResolved = true;
        dispatch(createGroupError({
            requestID: id,
            name,
            members,
            error,
        }));
        console.error(error);
    });
};
