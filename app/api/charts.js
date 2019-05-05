import { round, last } from 'lodash';

import { DisplayTypes } from './constants/ChartTypes';
import { ampsTokWh } from "./socket/usageUtils";

export const pieChart = (results, channels, type = DisplayTypes.PERCENT) => {
    const segments = [];
    if (type === DisplayTypes.PERCENT && results.length) {
        const lastItem = last(results);
        const channelAmps = [...lastItem.channels.entries()];

        const total = channelAmps.reduce((acc, [_, current]) => acc + current, 0);
        channelAmps.forEach(([channel, current]) => {
            const retrievedChannel = channels.get(channel) || {};
            if (current !== 0) {
                segments.push({
                    id: channel,
                    label: `${retrievedChannel.name || 'Unnamed Channel'} (kWh)`,
                    value: ampsTokWh(round(current / total, 2)),
                });
            }
        });
        return segments;
    }


    let total = 0;
    const amps = {};
    results.forEach(entry => {
        entry.channels.forEach((current, channel) => {
            amps[channel] = (amps[channel] || 0) + current;
            total += current;
        });
    });

    Object.entries(amps).forEach(([channel, current]) => {
        const retrievedChannel = channels.get(channel) || {};
        let value = 0;

        if (current !== 0) {
            switch (type) {
                case DisplayTypes.AVG:
                    value = ampsTokWh(round(current / results.length, 2));
                    break;
                case DisplayTypes.TOTAL:
                    value = ampsTokWh(round(current, 1));
                    break;
                default:
                    value = ampsTokWh(round(current / total, 2));
                    break;
            }
            segments.push({
                id: channel,
                label: `${retrievedChannel.name || 'Unnamed Channel'} (kWh)`,
                value,
            });
        }
    });

    return segments;
};
