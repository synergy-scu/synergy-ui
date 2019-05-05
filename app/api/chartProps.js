import moment from 'moment';
import PropTypes from 'prop-types';

export const defaultHistoryChart = ({
    chartID = '',
    variables = {},
    channels = [],
    members = [],
    duration = moment.duration(1),
    splitDuration = moment.duration(1),
    splitDurationPeriod = 'h',
    periods = new Set(),
    raw = [],
    results = [],
    groupedResults = [],
    timers = new Map(),
    groupedTimers = new Map(),
}) => {
    return {
        chartID,
        variables,
        channels,
        members,
        duration,
        splitDuration,
        splitDurationPeriod,
        periods,
        raw,
        results,
        groupedResults,
        timers,
        groupedTimers,
    };
};

export const historyChartProps = {
    chartID: PropTypes.string.isRequired,
    variables: PropTypes.object,
    channels: PropTypes.arrayOf(PropTypes.string),
    members: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        type: PropTypes.string,
    })),
    duration: PropTypes.object,
    splitDuration: PropTypes.object,
    splitDurationPeriod: PropTypes.string,
    periods: PropTypes.instanceOf(Set),
    raw: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        time: PropTypes.string,
        amps: PropTypes.number,
    })),
    results: PropTypes.arrayOf(PropTypes.shape({
        time: PropTypes.object,
        channels: PropTypes.instanceOf(Map),
    })),
    groupedResults: PropTypes.arrayOf(PropTypes.shape({
        time: PropTypes.object,
        members: PropTypes.instanceOf(Map),
    })),
    timers: PropTypes.instanceOf(Map),
    groupedTimers: PropTypes.instanceOf(Map),
};

export const defaultStream = ({
    chartID = '',
    streamID = '',
    start = moment(),
    channels = [],
    members = [],
    socket = null,
    connected = false,
    results = [],
    groupedResults = [],
    timers = new Map(),
    groupedTimers = new Map(),
}) => {
    return {
        chartID,
        streamID,
        start,
        channels,
        members,
        socket,
        connected,
        results,
        groupedResults,
        timers,
        groupedTimers,
    };
};

export const streamChartProps = {
    chartID: PropTypes.string.isRequired,
    streamID: PropTypes.string.isRequired,
    start: PropTypes.object,
    channels: PropTypes.arrayOf(PropTypes.string),
    members: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        type: PropTypes.string,
    })),
    socket: PropTypes.shape({
        disconnect: PropTypes.func.isRequired,
    }),
    connected: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.shape({
        time: PropTypes.object,
        channels: PropTypes.instanceOf(Map),
    })),
    groupedResults: PropTypes.arrayOf(PropTypes.shape({
        time: PropTypes.object,
        members: PropTypes.instanceOf(Map),
    })),
    timers: PropTypes.instanceOf(Map),
    groupedTimers: PropTypes.instanceOf(Map),
};
