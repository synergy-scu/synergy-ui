import moment from 'moment';
import { cloneDeep, round } from 'lodash';

import Actions from '../actions';
import { defaultHistoryChart } from '../api/chartProps';

export const histories = (state = new Map(), action) => {
    const nextState = new Map(state);

    switch (action.type) {
        case Actions.USAGE_START: {
            const startDate = action.payload.variables.startDate || moment('2019-01-01');
            const endDate = action.payload.variables.endDate || moment();

            const chartDuration = moment.duration(Math.abs(endDate.diff(startDate)));
            let splitDurationPeriod = 'h';
            if (chartDuration.asYears() >= 2) {
                splitDurationPeriod = 'y';
            } else if (chartDuration.asMonths() >= 6) {
                splitDurationPeriod = 'M';
            } else if (chartDuration.asWeeks() >= 4) {
                splitDurationPeriod = 'w';
            } else if (chartDuration.asDays() >= 2) {
                splitDurationPeriod = 'd';
            }

            const periods = new Set();
            const start = moment(startDate);
            while (start.valueOf() <= endDate.valueOf()) {
                const endOfPeriod = start.endOf(splitDurationPeriod);
                periods.add(endOfPeriod.valueOf());
                start.add(1, splitDurationPeriod);
            }

            const splitDuration = moment.duration(1, splitDurationPeriod);

            nextState.set(action.payload.chartID, defaultHistoryChart({
                chartID: action.payload.chartID,
                variables: action.payload.variables,
                channels: action.payload.channels,
                members: [...action.payload.members.values()],
                duration: chartDuration,
                splitDuration,
                splitDurationPeriod,
                periods,
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

                const timestamp = moment(time);
                const timePeriodCount = moment.duration(Math.abs(startDate.diff(timestamp))).as(chart.splitDurationPeriod);
                const timePeriod = moment(startDate).add(timePeriodCount, chart.splitDurationPeriod);
                const endOfPeriod = timePeriod.endOf(chart.splitDurationPeriod);

                if (chart.periods.has(endOfPeriod.valueOf())) {
                    // console.log(timestamp.format(), timePeriodCount, timePeriod.format(), endOfPeriod.format());

                    const period = results.get(endOfPeriod.valueOf()) || {};
                    const periodAmps = new Map(period.periodAmps || new Map());
                    const ampsTotal = (periodAmps.get(channelID) || 0) + amps;

                    const periodPoints = new Map(period.periodPoints || new Map());
                    const points = (periodPoints.get(channelID) || 0) + 1;

                    periodAmps.set(channelID, ampsTotal);
                    periodPoints.set(channelID, points);
                    results.set(endOfPeriod.valueOf(), {
                        time: endOfPeriod,
                        periodAmps,
                        periodPoints,
                    });

                    const parentID = action.payload.reverseLookup.get(channelID);
                    const groupedPeriod = groupedResults.get(endOfPeriod.valueOf()) || {};
                    const parentAmps = new Map(groupedPeriod.parentAmps || new Map());
                    const parentTotal = (parentAmps.get(parentID) || 0) + amps;

                    const parentPeriodPoints = new Map(groupedPeriod.parentPoints || new Map());
                    const parentPoints = (parentPeriodPoints.get(parentID) || 0) + 1;

                    parentAmps.set(parentID, parentTotal);
                    parentPeriodPoints.set(parentID, parentPoints);
                    groupedResults.set(endOfPeriod.valueOf(), {
                        time: endOfPeriod,
                        parentAmps,
                        parentPeriodPoints,
                    });

                    const lastTimestamp = lastTimestamps.get(channelID) || timestamp;
                    const prevDuration = (chart.timers.get(channelID) || moment.duration(500)).asMilliseconds();
                    lastTimestamps.set(channelID, timestamp);

                    const lastGroupedTimestamp = lastTimestamps.get(parentID) || timestamp;
                    const prevGroupedDuration = (chart.groupedTimers.get(parentID) || moment.duration(500)).asMilliseconds();
                    lastGroupedTimestamps.set(parentID, timestamp);

                    if (amps > 0) {
                        chart.timers.set(channelID, moment.duration(prevDuration + Math.abs(timestamp.diff(lastTimestamp))));
                        chart.groupedTimers.set(parentID, moment.duration(prevGroupedDuration + Math.abs(timestamp.diff(lastGroupedTimestamp))));
                    }
                }
            });

            chart.results = [];
            chart.groupedResults = [];
            chart.periods.forEach(period => {
                if (results.has(period)) {
                    const result = results.get(period);
                    chart.results.push({
                        time: result.time,
                        channels: new Map([...result.periodAmps.entries()].map(([channelID, amperage]) => {
                            const count = result.periodPoints.get(channelID) || 1; // This should never fail
                            return [channelID, round(amperage / count, 3)];
                        })),
                    });

                    const groupedResult = groupedResults.get(period);
                    chart.groupedResults.push({
                        time: groupedResult.time,
                        members: new Map([...groupedResult.parentAmps.entries()].map(([parentID, amperage]) => {
                            const count = groupedResult.parentPeriodPoints.get(parentID) || 1; // This should never fail
                            return [parentID, round(amperage / count, 3)];
                        })),
                    });
                } else {
                    chart.results.push({
                        time: moment(period),
                        channels: new Map(),
                    });

                    chart.groupedResults.push({
                        time: moment(period),
                        members: new Map(),
                    });
                }
            });


            chart.raw = action.payload.data.results;

            nextState.set(action.payload.chartID, defaultHistoryChart({ ...cloneDeep(chart) }));

            return nextState;
        }
        default:
            return state;
    }
};

