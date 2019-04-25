import { get } from 'lodash';
import { ChartTypes, UsageTypes } from '../constants/ChartTypes';

export const normalizeChart = ({ name, chartID, chartType, usageType, options = {}, members, all, created, updated }) => {
    return {
        key: chartID,
        name,
        chartID,
        chartType: get(ChartTypes, chartType.toUpperCase(), ChartTypes.NONE),
        usageType: get(UsageTypes, usageType.toUpperCase(), UsageTypes.NONE),
        options,
        count: members,
        members: [],
        all: all === 1,
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
        name,
        groupID,
        count: members,
        members: [],
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
    // Extracting the 'id' so it doesnt get included in ...device
    return {
        key: deviceID,
        name,
        deviceID,
        count: channels,
        channels: new Set(),
        created: new Date(created),
        updated: new Date(updated),
    };
};

export const normalizeChannel = ({ name, channelID, deviceID, created, updated }) => {
    return {
        key: channelID,
        name,
        channelID,
        deviceID,
        created: new Date(created),
        updated: new Date(updated),
    };
};

export const extractGroupChannels = (group, entities, extractedChannels = new Set()) => {
    group.members.forEach(member => {
        switch (member.type) {
            case 'group': {
                const nextGroup = entities.groups.get(member.uuid);
                if (nextGroup) {
                    extractGroupChannels(nextGroup, entities, extractedChannels);
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
        case 'charling':
            return normalizeChartMember(data);
        case 'devices':
            return normalizeDevice(data);
        case 'channels':
            return normalizeChannel(data);
        default:
            return {};
    }
};


