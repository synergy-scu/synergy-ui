import moment from 'moment';
import { round } from 'lodash';

export const defaultStream = ({ chartID = '', streamID = '', start = moment(), channels = [], members = [], socket = null, connected = false, results = [], groupedResults, timers = new Map(), groupedTimers = new Map() }) => {
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

export const extractGroupedMembers = (members, entities) =>
    members.map(member => {
        const extractedMember = entities[`${member.type}s`].get(member.uuid) || {};
        const minimumMember = {
            uuid: member.uuid,
            type: member.type,
        };

        switch (member.type) {
            case 'group':
                minimumMember.channels = extractedMember.extracted;
                break;
            case 'device':
                minimumMember.channels = new Set(extractedMember.channels.map(channel => channel.uuid));
                break;
            case 'channel':
                minimumMember.channels = new Set(member.uuid);
                break;
            default:
                minimumMember.channels = new Set();
                break;
        }

        return minimumMember;
    });

export const getChannelsFromGroup = members => {
    let channels = new Set();
    members.forEach(member => {
        channels = new Set([...channels, ...member.channels]);
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

export const calculateAverage = (channels, results) => {
    if (!results.length) {
        return {};
    }

    const averages = {};
    channels.forEach(channel => {
        averages[channel] = 0;
    });

    results.forEach(result => {
        [...result.channels.entries()].forEach(([channel, amperage]) => {
            averages[channel] += amperage;
        });
    });

    Object.keys(averages).forEach(channel => {
        averages[channel] /= results.length;
    });

    return averages;
};

export const calculateKWHs = (averages, timers) =>
    Object.entries(averages).reduce((total, [channel, amperage]) => {
        const durationInMillis = timers.get(channel).asMilliseconds();
        const durationInHours = millisToHours(durationInMillis);
        return total + ampsTokWh(amperage, durationInHours);
    }, 0);

export const calculateCost = (kWhs, costPerKWH) => kWhs * costPerKWH;
