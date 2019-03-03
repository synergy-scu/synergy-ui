import { uuidv4 } from 'uuid/v4';
import bcrypt from 'bcryptjs';

import { default as Actions } from './types';

export const changeUser = user => {
    return {
        type: Actions.CHANGE_USER,
        payload: {
            user,
        },
    };
};

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

export const loginError = ({ requestID, hasResponse, message, altMessage, ...params }) => {
    return {
        type: Actions.LOGIN_ERROR,
        payload: {
            requestID,
            hasResponse,
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
        axios.post('login', {
            email,
        }).then(response => response.data)
            .then(response => {
                if (response.hash) {
                    bcrypt.compare(password, response.hash)
                        .then(isMatch => {
                            if (isMatch) {
                                dispatch(loginSuccess({
                                    requestID: id,
                                    user: {
                                        userID: response.userID,
                                        name: response.name,
                                        email: response.email,
                                        familySize: response.familySize,
                                    },
                                }));
                            } else {
                                dispatch(loginError({
                                    requestID: id,
                                    hasResponse: true,
                                    message: 'The user\'s password is incorrect',
                                    altMessage: 'Your password is incorrect. Try again or create a new user.'
                                }));
                            }
                        });
                } else {
                    dispatch(loginError({
                        requestID: id,
                        hasResponse: true,
                        message: 'This user does not exist in the database',
                        altMessage: 'This account does not exist. Please create a new user.',
                    }));
                }
                
            })
            .catch(error => {
                if (error.response) {
                    dispatch(loginError({
                        requestID: id,
                        hasResponse: true,
                        message: error.response.message,
                        request: error.request,
                        code: error.request.status,
                    }));
                    console.error('An error occured receiving the response\n', error.response);
                } else if (error.request) {
                    dispatch(loginError({
                        requestID: id,
                        hasResponse: false,
                        message: 'An error occured sending the login request',
                        request: error.request,
                        code: error.request.status,
                    }));
                    console.error('An error occured sending the login request\n', error.response.statusText);
                } else {
                    dispatch(loginError({
                        requestID: id,
                        hasResponse: false,
                        message: 'An error occured with the login request generation',
                    }));
                    console.error('An error occured with the login request generation\n', error);
                }
            });
    };
};