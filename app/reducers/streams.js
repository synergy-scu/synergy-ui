import moment from 'moment';
import { last, cloneDeep } from 'lodash';

import IO from '../Socket';
import Actions from '../actions';
import { defaultStream } from '../api/socket/usageUtils';

const MAX_RESULTS = 1000;

export const streams = (state = new Map(), action) => {
    const nextState = new Map(state);

    switch (action.type) {
        case Actions.STREAM_NEW:
            nextState.set(action.payload.chartID, defaultStream({
                chartID: action.payload.chartID,
                streamID: action.payload.streamID,
                channels: action.payload.channels,
                socket: action.payload.socket,
                timers: new Map(action.payload.channels.map(channel => [channel, moment.duration(500)])),
            }));
            return nextState;
        case Actions.STREAM_CONNECT:
            nextState.set(action.payload.chartID, defaultStream({
                ...state.get(action.payload.chartID),
                connected: true,
            }));
            return nextState;
        case Actions.STREAM_RECONNECTING:
            nextState.set(action.payload.chartID, defaultStream({
                ...state.get(action.payload.chartID),
                connected: false,
            }));
            return nextState;
        case Actions.STREAM_DISCONNECT:
            nextState.set(action.payload.chartID, defaultStream({
                ...state.get(action.payload.chartID),
                connected: false,
            }));
            return nextState;
        case Actions.STREAM_CLOSE: {
            nextState.delete(action.payload.chartID);
            delete IO.nsps[`/${action.payload.chartID}`];
            return nextState;
        }
        case Actions.STREAM_RESULT: {

            // const stream.results = [{
            //     time,
            //     channels: new Map([[channel, amp], [channel, amp]])
            // }]

            const stream = state.get(action.payload.chartID);
            const defaultMap = new Map(stream.channels.map(channel => [channel, 0]));

            // If there are no results to display, set usages to 0
            if (action.payload.data.results.length === 0) {
                const results = [...stream.results];
                results.push({
                    time: moment(),
                    channels: defaultMap,
                });

                nextState.set(action.payload.chartID, {
                    ...stream,
                    results,
                });


            // Set usages to results
            } else {

                // Only keep the last MAX_RESULTS items
                if (stream.results.length + 1 > MAX_RESULTS) {
                    const numToShift = stream.results.length + 1 - MAX_RESULTS;
                    stream.results.splice(0, numToShift);
                }

                const lastResult = last(stream.results) || {};
                const prevChannels = new Map(lastResult.channels || new Map());
                const channels = new Map();

                const now = moment();
                const lastTime = lastResult.time || moment();

                // If a channel does not exist, fill it in with its previous value or a 0
                if (action.payload.data.results.length !== stream.channels.length) {
                    const actionChannelIDs = new Set(action.payload.data.results.map(channel => channel.channelID));
                    stream.channels.forEach(channel => {
                        if (!actionChannelIDs.has(channel)) {
                            channels.set(channel, prevChannels.get(channel) || 0);
                        }
                    });
                }

                // Add the channel usage data to the array
                action.payload.data.results.forEach(({ channelID, amps }) => {
                    channels.set(channelID, amps);

                    const prevDuration = (stream.timers.get(channelID) || moment.duration(500)).asMilliseconds();
                    if (amps > 0) {
                        stream.timers.set(channelID, moment.duration(prevDuration + (now.valueOf() - lastTime.valueOf())));
                    }
                });

                stream.results.push({
                    time: moment(),
                    channels,
                });

                nextState.set(action.payload.chartID, defaultStream({ ...cloneDeep(stream) }));

            }
            return nextState;
        }

        default:
            return state;
    }
};

export const streamErrors = (state = new Map(), action) => {
    const nextState = new Map(state);

    switch (action.type) {
        case Actions.STREAM_CONNECT_ERROR:
            nextState.set(action.payload.chartID, {
                message: action.payload.message,
                error: action.payload.error,
            });
            return nextState;
        case Actions.STREAM_ERROR:
            nextState.set(action.payload.chartID, {
                error: action.payload.error,
                message: 'An error occurred retrieving usage data from the server',
            });
            return nextState;
        case Actions.STREAM_DISCONNECT:
            nextState.set(action.payload.chartID, {
                error: null,
                message: 'The socket disconnected. Attempting to reconnect',
                reason: action.payload.reason,
            });
            return nextState;
        case Actions.STREAM_CLOSE:
            nextState.delete(action.payload.chartID);
            return nextState;
        default:
            break;
    }
};
