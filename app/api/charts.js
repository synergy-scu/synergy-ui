import UMPStore from '../Store';

import { UsageTypes, defaultChart } from './constants/ChartTypes';
import { extractGroupedMembers, getChannelsFromGroup } from './socket/usageUtils';

export const fetchChart = ({ axios, usageType, chartID, requestStream, requestHistory }) => {
    const entities = UMPStore.store.getState().entities;
    const chart = entities.charts.get(chartID) || defaultChart();

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

        const requestFn = usageType === UsageTypes.REALTIME ? requestStream : requestHistory;
        return UMPStore.dispatch(
            requestFn({
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
            })
        );
    }
};
