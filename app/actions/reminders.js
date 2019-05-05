import uuidv4 from 'uuid/v4';

import Actions from './types';
import { fetchEntity } from './entities';

export const createReminderStart = ({ channel, time, message }) => {
    return {
        type: Actions.CREATE_REMINDER_START,
        payload: {
            requestID: uuidv4(),
            channel,
            time,
            message,
        },
    };
};

export const createReminderSuccess = ({ requestID, reminderID, ...props }) => {
    return {
        type: Actions.CREATE_REMINDER_SUCCESS,
        payload: {
            requestID,
            reminderID,
            ...props,
        },
    };
};

export const createReminderError = ({ requestID, error, ...props }) => {
    return {
        type: Actions.CREATE_REMINDER_ERROR,
        payload: {
            requestID,
            error,
            ...props,
        },
    };
};

export const createReminder = ({ axios, channel, time, message }) => dispatch => {
    const newCreateReminderAction = createReminderStart({ channel, time, message });
    const requestID = newCreateReminderAction.payload.requestID;
    dispatch(newCreateReminderAction);

    let isResolved = false;
    setTimeout(() => {
        if (!isResolved) {
            dispatch(createReminderError({
                requestID,
                error: 'Unable to create reminder: Request timed out',
            }));
        }
    }, 30 * 1000);

    return axios.post('/reminder/create', {
        variables: {
            channelID: channel,
            message,
            time,
        },
    }).then(response =>
        response.status === 201
            ? response.data
            : Promise.reject(response.error)
    ).then(data => {
        isResolved = true;
        dispatch(createReminderSuccess({
            requestID,
            reminderID: data.reminderID,
        }));
        dispatch(fetchEntity({
            axios,
            entityType: 'reminder',
            uuid: data.reminderID,
        }));
    }).catch(error => {
        isResolved = true;
        console.error(error);
        dispatch(createReminderError({
            requestID,
            error,
        }));
    });
};
