export default {
    INVALID_USER: {
        type: 'INVALID_USER',
        message: 'Invalid user credentials',
        altMessage: 'Your username or password is incorrect. Try again or create a new user',
    },
    INVALID_PASSWORD: {
        type: 'INVALID_PASSWORD',
        message: 'Invalid user credentials',
        altMessage: 'Your password is incorrect. Try again or reset your password',
    },
    BCRYPT_FAILURE: {
        type: 'BCRYPT_FAILURE',
        message: 'bcrypt failed to resolve password',
        altMessage: 'An error occurred verifying your password. Please wait a couple of minutes and try again.',
    },

    LOGIN_TIMEOUT: {
        type: 'LOGIN_TIMEOUT',
        message: 'Login request timed out',
        altMessage: 'Your login request timed out. Please wait a couple of minutes and try again.',
    },

    UNKNOWN: {
        type: 'UNKNOWN',
        message: 'Unknown Error',
        altMessage: 'An unknown error occurred. Please report this issue to the system administrator.',
    },
};
