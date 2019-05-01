import IO from '../Socket';
import Actions from './types';
import moment from 'moment';

export const streamNew = ({ chartID, streamID, channels, members, socket }) => {
    return {
        type: Actions.STREAM_NEW,
        payload: {
            chartID,
            streamID,
            channels,
            members,
            socket,
        },
    };
};

export const streamConnect = chartID => {
    return {
        type: Actions.STREAM_CONNECT,
        payload: {
            chartID,
        },
    };
};

export const streamConnectError = ({ chartID, error = null, message = '' }) => {
    return {
        type: Actions.STREAM_CONNECT_ERROR,
        payload: {
            chartID,
            error,
            message,
        },
        error: true,
    };
};

export const streamReconnecting = (chartID, attempt) => {
    return {
        type: Actions.STREAM_RECONNECTING,
        payload: {
            chartID,
            attempt,
        },
    };
};

export const streamDisconnect = (chartID, reason) => {
    return {
        type: Actions.STREAM_DISCONNECT,
        payload: {
            chartID,
            reason,
        },
        error: true,
    };
};

export const streamClose = chartID => {
    return {
        type: Actions.STREAM_CLOSE,
        payload: {
            chartID,
        },
    };
};

export const streamResult = (chartID, data, reverseLookup) => {
    return {
        type: Actions.STREAM_RESULT,
        payload: {
            chartID,
            data,
            reverseLookup,
        },
    };
};

export const streamError = (chartID, error) => {
    return {
        type: Actions.STREAM_ERROR,
        payload: {
            chartID,
            error,
        },
        error: true,
    };
};

export const streamUsage = ({ streamID, chartID, chartMeta, channels, members }) => dispatch => {
    const socket = IO.socket(`/${chartID}`);
    let responseNum = 0;
    let responseTime = moment();

    const reverseLookup = new Map();
    members.forEach(member => {
        member.channels.forEach(channel => reverseLookup.set(channel, member.uuid));
    });

    dispatch(streamNew({ chartID, streamID, channels, members, socket }));

    socket.on('usage', response => {
        const now = moment();
        if (Array.isArray(response.data.results)) {
            // console.log('#', responseNum, ' in ', now.valueOf() - responseTime.valueOf(), 'ms');
            responseNum++;
            responseTime = now;
            dispatch(streamResult(chartID, response.data, reverseLookup));
        }
    });

    socket.on('usage-error', response => {
        console.error(response);
        dispatch(streamError(chartID, response.error));
    });

    // System Event Handlers
    socket.on('connect', () => {
        console.info('Stream Connected to Backend');
        dispatch(streamConnect(chartID));
    });

    socket.on('connect_error', error => {
        dispatch(streamConnectError({
            chartID,
            error,
            message: 'An error occurred attempting to connect to the server',
        }));
    });

    socket.on('connect_timeout', () => {
        dispatch(streamConnectError({
            chartID,
            message: 'Connection Timed Out',
        }));
    });

    socket.on('reconnect', () => {
        socket.open();
        dispatch(streamConnect(chartID));
    });

    socket.on('reconnecting', attempt => {
        dispatch(streamReconnecting(chartID, attempt));
    });

    socket.on('reconnect_error', error => {
        dispatch(streamConnectError({
            chartID,
            error,
            message: 'An error occurred while attempting to reconnect',
        }));
    });

    socket.on('reconnect_failed', () => {
        dispatch(streamConnectError({
            chartID,
            message: 'Failed to reconnect. Aborting!',
        }));
    });

    socket.on('disconnect', reason => {
        console.log(`Socket Disconnected due to: ${reason}`);
        if (reason === 'io client disconnect') {
            dispatch(streamClose(chartID));
        } else {
            dispatch(streamDisconnect(chartID, reason));
        }
    });

};
