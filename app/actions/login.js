import uuidv4 from 'uuid/v4';
import bcrypt from 'bcryptjs';
import { get } from 'lodash';

import { default as Actions } from './types';
import { fetchAll } from './queryAll';
import ErrorTypes from '../api/constants/ErrorTypes';
import AXIOS_TIMEOUT from '../api/constants/AxiosTimeout';

export const loginStart = () => {
    return {
        type: Actions.LOGIN_START,
        payload: {
            requestID: uuidv4(),
        },
    };
};

export const loginSuccess = ({ requestID, user }) => {
    return {
        type: Actions.LOGIN_SUCCESS,
        payload: {
            requestID,
            user,
        },
    };
};

export const loginError = ({ requestID, type = ErrorTypes.UNKNOWN, message, altMessage = '', ...params }) => {
    return {
        type: Actions.LOGIN_ERROR,
        payload: {
            requestID,
            type,
            message,
            altMessage,
            ...params,
        },
        error: true,
    };
};

export const userLogin = ({ email, password, saveSession, axios }) => {
    const newLogin = loginStart();
    const id = newLogin.payload.requestID;

    return dispatch => {
        let isResolved = false;
        setTimeout(() => {
            if (!isResolved) {
                const { type, message, altMessage } = ErrorTypes.LOGIN_TIMEOUT;
                dispatch(loginError({
                    requestID: id,
                    type,
                    message,
                    altMessage,
                }));
            }
        }, AXIOS_TIMEOUT);

        axios.post('login', {
            variables: {
                email,
            },
        }).then(response => response.data ? response.data : response.error)
            .then(data => {
                isResolved = true;
                bcrypt.compare(password, get(data, 'password', ''))
                    .then(isMatch => {
                        if (isMatch) {
                            dispatch(loginSuccess({
                                requestID: id,
                                user: {
                                    userID: get(data, 'id', -1),
                                    email,
                                    name: get(data, 'name', ''),
                                    phone: get(data, 'phone', ''),
                                    familySize: get(data, 'family_size', 1),
                                    cost: get(data, 'cost', 0),
                                },
                            }));

                            dispatch(fetchAll({ axios }));
                        } else {
                            const { type, message, altMessage } = ErrorTypes.INVALID_PASSWORD;
                            dispatch(loginError({
                                requestID: id,
                                type,
                                message,
                                altMessage,
                            }));
                        }
                    })
                    .catch(error => {
                        const { type, message, altMessage } = ErrorTypes.BCRYPT_FAILURE;
                        dispatch(loginError({
                            requestID: id,
                            type,
                            message,
                            altMessage,
                            error,
                        }));
                    });
            })
            .catch(error => {
                isResolved = true;
                const { type, message, altMessage } = ErrorTypes.UNKNOWN;
                dispatch(loginError({
                    requestID: id,
                    type,
                    message,
                    altMessage,
                    ...error,
                }));
            });
    };
};
