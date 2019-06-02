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
                members: [...action.payload.members.values()],
                socket: action.payload.socket,
                timers: new Map(action.payload.channels.map(channel => [channel, moment.duration(500)])),
                groupedTimers: new Map(action.payload.members.map(member => [member, moment.duration(500)])),
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
        case Actions.CHANGE_CHART:
            state.forEach(stream => {
                if (stream.chartID === action.payload.chartID && stream.paused) {
                    stream.socket.emit('play', {
                        chartID: action.payload.chartID,
                        streamID: action.payload.streamID,
                    });
                    nextState.set(action.payload.chartID, defaultStream({
                        ...stream,
                        paused: false,
                    }));
                } else if (stream.chartID !== action.payload.chartID) {
                    stream.socket.emit('pause', {
                        chartID: action.payload.chartID,
                        streamID: action.payload.streamID,
                    });
                    nextState.set(stream.chartID, defaultStream({
                        ...stream,
                        paused: true,
                    }));
                }
            });
            return nextState;
        case Actions.STREAM_PAUSE: {
            const stream = state.get(action.payload.chartID);
            stream.socket.emit(stream.paused ? 'play' : 'pause', {
                chartID: action.payload.chartID,
                streamID: action.payload.streamID,
            });
            nextState.set(action.payload.chartID, defaultStream({
                ...stream,
                paused: action.payload.shouldPause,
            }));
            return nextState;
        }
        case Actions.STREAM_RESULT: {

            /**
             * @example
             * const stream.results = [{
             *      time,
             *      channels: new Map([[channel, amp], [channel, amp], etc...]),
             * }];
             */

            const stream = state.get(action.payload.chartID);
            const defaultMap = new Map(stream.channels.map(channel => [channel, 0]));
            const defaultGroupedMap = new Map(stream.members.map(member => [member.uuid, 0]));

            // If there are no results to display, set usages to 0
            if (action.payload.data.results.length === 0) {
                const results = [...stream.results];
                results.push({ time: moment(), channels: defaultMap });

                const groupedResults = [...stream.groupedResults];
                groupedResults.push({ time: moment(), members: defaultGroupedMap });

                nextState.set(action.payload.chartID, {
                    ...stream,
                    results,
                    groupedResults,
                });


            // Set usages to results
            } else {

                // Only keep the last MAX_RESULTS items
                if (stream.results.length + 1 > MAX_RESULTS) {
                    const numResultsToShift = stream.results.length + 1 - MAX_RESULTS;
                    stream.results.splice(0, numResultsToShift);

                    const numGroupedResultsToShift = stream.groupedResults.length + 1 - MAX_RESULTS;
                    stream.groupedResults.splice(0, numGroupedResultsToShift);
                }

                const lastResult = last(stream.results) || {};
                const lastGroupedResult = last(stream.groupedResults) || {};

                const prevChannels = new Map(lastResult.channels || new Map());
                const channels = new Map();
                const members = new Map();

                const now = moment();
                const lastTime = lastResult.time || moment();
                const lastGroupedTime = lastGroupedResult.time || moment();

                // If a channel does not exist, fill it in with its previous value or a 0
                if (action.payload.data.results.length !== stream.channels.length) {
                    const resultChannelIDs = new Set(action.payload.data.results.map(channel => channel.channelID));
                    stream.channels.forEach(channel => {
                        if (!resultChannelIDs.has(channel)) {
                            channels.set(channel, prevChannels.get(channel) || 0);
                        }
                    });
                }

                // Add the channel usage data to the array
                action.payload.data.results.forEach(({ channelID, amps }) => {
                    channels.set(channelID, amps);

                    const parentID = action.payload.reverseLookup.get(channelID);
                    const parentTotal = (members.get(parentID) || 0) + amps;
                    members.set(parentID, parentTotal);

                    const prevDuration = (stream.timers.get(channelID) || moment.duration(500)).asMilliseconds();
                    const prevGroupedDuration = (stream.groupedTimers.get(parentID) || moment.duration(500)).asMilliseconds();

                    if (amps > 0) {
                        stream.timers.set(channelID, moment.duration(prevDuration + (now.valueOf() - lastTime.valueOf())));
                        stream.groupedTimers.set(parentID, moment.duration(prevGroupedDuration + (now.valueOf() - lastGroupedTime.valueOf())));
                    }
                });

                stream.results.push({
                    time: moment(),
                    channels,
                });

                stream.groupedResults.push({
                    time: moment(),
                    members,
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
            return state;
    }
};
