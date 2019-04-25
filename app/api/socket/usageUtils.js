import moment from 'moment';
import { round } from 'lodash';

export const defaultStream = ({ chartID = '', streamID = '', start = moment(), channels = [], socket = null, connected = false, results = [], timers = new Map() }) => {
    return {
        chartID,
        streamID,
        start,
        channels,
        socket,
        connected,
        results,
        timers,
    };
};

export const getUniqueChannels = items => {
    const channels = new Map();
    items.forEach(usage => {
        if (channels.has(usage.channelID)) {
            const existingTime = channels.get(usage.channelID).time;
            const time = moment(usage.time);

            // Get the channel amperage that happened latest
            if (time.isAfter(existingTime)) {
                channels.set(usage.channelID, {
                    amps: usage.amps,
                    time,
                });
            }
        } else {
            channels.set(usage.channelID, {
                amps: usage.amps,
                time: moment(usage.time),
            });
        }
    });
    return channels;
};

// Total Current * 120V * 24h = Wh / 1000 = kWh
export const ampsTokWh = (amps, time = 24) => round(amps * 120 * time / 1000, 9);
export const millisToHours = millis => millis / 1000 / 60 / 60;

export const stripLongDecimal = value => {
    if (value < 1) {
        const str = value.toString();
        let i;
        for (i = 0; i < str.length; i++) {
            if (str[i] !== '0' && str[i] !== '.') {
                break;
            }
        }

        return str.slice(0, i + 2);
    }

    return value.toFixed(2);
};

export const combineUsages = amps => amps.reduce((acc, curr) => acc + curr, 0);
