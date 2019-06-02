import moment from 'moment';

import UMPStore from '../Store';

import { UsageTypes, defaultChart, ChartTypes } from './constants/ChartTypes';
import { extractGroupedMembers, getChannelsFromGroup } from './socket/usageUtils';
import { updateCumulativeChart } from '../actions/charts';

export const getCumulativeChart = (chartID, usageType, channels) =>
    defaultChart({
        chartID,
        name: 'Cumulative Usage',
        chartType: usageType === UsageTypes.REALTIME ? ChartTypes.PIE : ChartTypes.LINE,
        usageType,
        options: {},
        count: channels.size,
        members: [...channels.values()].map(channel => {
            return {
                type: 'channel',
                uuid: channel.uuid,
            };
        }),
        all: true,
        created: moment(),
        updated: moment(),
    });

export const fetchChart = ({ axios, usageType, chartID, requestStream, requestHistory, isCumulative }) => {
    const entities = UMPStore.store.getState().entities;
    const chart = isCumulative ? getCumulativeChart(chartID, usageType, entities.channels) : entities.charts.get(chartID) || defaultChart();

    if (chart.uuid.length) {
        const members = extractGroupedMembers(chart.members, entities);
        const channels = getChannelsFromGroup(members);

        const variables = {};
        if (chart.options.startDate) {
            variables.startDate = chart.options.startDate;
        }

        if (chart.options.endDate) {
            variables.endDate = chart.options.endDate;
        }

        if (isCumulative) {
            UMPStore.dispatch(updateCumulativeChart(usageType, chart));
        }

        const requestFn = usageType === UsageTypes.REALTIME ? requestStream : requestHistory;
        return requestFn({
            axios,
            chartID: chart.chartID,
            chartMeta: {
                chartType: chart.chartType,
                usageType: chart.usageType,
                ...chart.options,
            },
            variables,
            channels: [...channels.values()],
            members,
            isCumulative,
        });
    }
};
