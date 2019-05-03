import moment from 'moment';
import { cloneDeep } from 'lodash';

import Actions from '../actions';

const defaultChart = ({
    chartID = '',
    variables = {},
    channels = [],
    members = [],
    duration = moment.duration(1),
    splitDuration = moment.duration(1),
    splitDurationPeriod = 'd',
    raw = [],
    channelResults = [],
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
        raw,
        channelResults,
        groupedResults,
        timers,
        groupedTimers,
    };
};

export const historyCharts = (state = new Map(), action) => {
    const nextState = new Map(state);

    switch (action.type) {
        case Actions.USAGE_START: {
            const startDate = action.payload.variables.startDate || moment('2019-01-01');
            const endDate = action.payload.variables.endDate || moment();

            const chartDuration = moment.duration(endDate.diff(startDate));
            let splitDurationPeriod = 'd';
            if (chartDuration.asYears() >= 2) {
                splitDurationPeriod = 'y';
            } else if (chartDuration.asMonths() >= 6) {
                splitDurationPeriod = 'M';
            } else if (chartDuration.asWeeks() >= 4) {
                splitDurationPeriod = 'w';
            }

            const splitDuration = moment.duration(1, splitDurationPeriod);

            nextState.set(action.payload.chartID, defaultChart({
                chartID: action.payload.chartID,
                variables: action.payload.variables,
                channels: action.payload.channels,
                members: [...action.payload.members.values()],
                duration: chartDuration,
                splitDuration,
                splitDurationPeriod,
                timers: new Map(action.payload.channels.map(channel => [channel, moment.duration(500)])),
                groupedTimers: new Map(action.payload.members.map(member => [member, moment.duration(500)])),
            }));
            return nextState;
        }
        case Actions.USAGE_SUCCESS: {
            const chart = state.get(action.payload.chartID);
            const startDate = chart.variables.startDate || moment('2019-01-01');

            const results = new Map();
            const groupedResults = new Map();
            const lastTimestamps = new Map();
            const lastGroupedTimestamps = new Map();

            action.payload.data.results.forEach(({ channelID, amps, time }) => {
                const start = moment(startDate);
                const parentID = action.payload.reverseLookup.get(channelID);

                const timestamp = moment(time);
                const timePeriodCount = moment.duration(startDate.diff(timestamp)).as(chart.splitDurationPeriod);
                const timePeriod = moment(start.add(timePeriodCount, chart.splitDurationPeriod));
                const endOfPeriod = timePeriod.endOf(chart.splitDurationPeriod);

                const period = results.get(endOfPeriod) || {};
                const channels = new Map(period.channels || new Map());
                const channelTotal = (channels.get(channelID) || 0) + amps;
                channels.set(channelID, channelTotal);
                results.set(endOfPeriod, {
                    time: endOfPeriod,
                    channels,
                });

                const groupedPeriod = groupedResults.get(endOfPeriod) || {};
                const members = new Map(groupedPeriod.members || new Map());
                const parentTotal = (members.get(parentID) || 0) + amps;
                members.set(parentID, parentTotal);
                groupedResults.set(endOfPeriod, {
                    time: endOfPeriod,
                    members,
                });

                const lastTimestamp = lastTimestamps.get(channelID);
                const prevDuration = (chart.timers.get(channelID) || moment.duration(500)).asMilliseconds();
                lastTimestamps.set(channelID, timestamp);

                const lastGroupedTimestamp = lastTimestamps.get(parentID);
                const prevGroupedDuration = (chart.groupedTimers.get(parentID) || moment.duration(500)).asMilliseconds();
                lastGroupedTimestamps.set(parentID, timestamp);

                if (amps > 0) {
                    chart.timers.set(channelID, moment.duration(prevDuration + timestamp.diff(lastTimestamp)));
                    chart.groupedTimers.set(parentID, moment.duration(prevGroupedDuration + timestamp.diff(lastGroupedTimestamp)));
                }
            });


            chart.raw = action.payload.data.results;
            chart.channelResults = [...results.values()];
            chart.groupedResults = [...groupedResults.values()];

            console.log(chart);

            nextState.set(action.payload.chartID, defaultChart({ ...cloneDeep(chart) }));

            return nextState;
        }
        default:
            return state;
    }
};

