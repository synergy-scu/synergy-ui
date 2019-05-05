import { get } from 'lodash';
import moment from 'moment';

import { ChartTypes, UsageTypes } from '../constants/ChartTypes';

export const normalizeChart = ({ name, chartID, chartType, usageType, options = {}, members, all, created, updated }) => {
    return {
        key: chartID,
        uuid: chartID,
        name,
        chartID,
        chartType: get(ChartTypes, chartType.toUpperCase(), ChartTypes.NONE),
        usageType: get(UsageTypes, usageType.toUpperCase(), UsageTypes.NONE),
        options: options ? JSON.parse(options, (key, value) => {
            if (typeof value === 'string') {
                const date = moment(value);
                if (date.isValid()) {
                    return date;
                }
            }
            return value;
        }) : {},
        count: members,
        members: [],
        extracted: new Set(),
        all: all === 1 || all === true,
        created: new Date(created),
        updated: new Date(updated),
    };
};

export const normalizeChartMember = ({ chartID, uuid, type, added }) => {
    return {
        chartID,
        uuid,
        type,
        added: new Date(added),
    };
};

export const normalizeGroup = ({ name, groupID, members, created, updated }) => {
    return {
        key: groupID,
        uuid: groupID,
        name,
        groupID,
        count: members,
        members: [],
        extracted: new Set(),
        created: new Date(created),
        updated: new Date(updated),
    };
};

export const normalizeGroupMember = ({ groupID, uuid, type, added }) => {
    return {
        groupID,
        uuid,
        type,
        added: new Date(added),
    };
};

export const normalizeDevice = ({ name, deviceID, channels, created, updated }) => {
    return {
        key: deviceID,
        uuid: deviceID,
        name,
        deviceID,
        count: channels,
        channels: [],
        created: new Date(created),
        updated: new Date(updated),
    };
};

export const normalizeChannel = ({ name, channelID, deviceID, created, updated }) => {
    return {
        key: channelID,
        uuid: channelID,
        name,
        channelID,
        deviceID,
        created: new Date(created),
        updated: new Date(updated),
    };
};

export const normalizeReminder = ({ reminderID, channelID, message, time, created, updated }) => {
    return {
        key: reminderID,
        uuid: reminderID,
        reminderID,
        channelID,
        channel: {},
        message,
        time,
        created,
        updated,
    };
};

export const extractChannels = (group, entities, extractedChannels = new Set()) => {
    group.members.forEach(member => {
        switch (member.type) {
            case 'group': {
                const nextGroup = entities.groups.get(member.uuid);
                if (nextGroup) {
                    extractChannels(nextGroup, entities, extractedChannels);
                }
                break;
            }
            case 'device': {
                const device = entities.devices.get(member.uuid);
                if (device) {
                    device.channels.forEach(channel => {
                        extractedChannels.add(channel);
                    });
                }
                break;
            }
            case 'channel': {
                const channel = entities.channels.get(member.uuid);
                if (channel) {
                    extractedChannels.add(channel.channelID);
                }
                break;
            }
            default:
                break;
        }
    });
    return extractedChannels;
};

export const normalize = (data, entityType) => {
    switch (entityType) {
        case 'groups':
            return normalizeGroup(data);
        case 'groupling':
            return normalizeGroupMember(data);
        case 'charts':
            return normalizeChart(data);
        case 'chartling':
            return normalizeChartMember(data);
        case 'devices':
            return normalizeDevice(data);
        case 'channels':
            return normalizeChannel(data);
        case 'reminders':
            return normalizeReminder(data);
        default:
            return {};
    }
};


