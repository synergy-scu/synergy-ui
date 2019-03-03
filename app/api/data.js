import uuidv4 from 'uuid/v4';
import faker from 'faker';
import _ from 'lodash';

export const genDevices = count => {
    const devices = new Map();
    const allChannels = [];

    for (let i = 0; i < count; i++) {
        const deviceID = uuidv4();
        const channels = new Map();
        for (let j = 1; j <= _.random(6, 12); j++) {
            const channelID = uuidv4();
            const channel = {
                channelID,
                deviceID,
                position: j,
                name: null,
                type: 'channel',
            };
            channels.set(channelID, channel);
            allChannels.push(channel);
        }
        devices.set(deviceID, {
            deviceID,
            channels,
            name: null,
            type: 'device',
        });
    }
    return { devices, allChannels };
};

export const genGroups = (count, { devices, allChannels }) => {
    const groups = new Map();
    for (let i = 0; i < count; i++) {
        const groupID = uuidv4();
        const members = [];
        for (let j = 0; j < _.random(3, 8); j++) {
            const grouping = _.random(2);
            let selection = null;
            let selectionType = null;
            if (grouping === 2) {
                selection = [...devices.values()][_.random(0, devices.size - 1)];
            } else if (grouping === 0 && !groups.size || grouping === 1) {
                selection = allChannels[_.random(0, allChannels.length - 1)];
            } else {
                selection = [...groups.values()][_.random(0, groups.size - 1)];
            }
            selectionType = selection.type;
            members.push({
                type: selectionType,
                uuid: selection[selectionType.concat('ID')],
            });
        }
        groups.set(groupID, {
            groupID,
            members,
            name: null,
            type: 'group',
        });
    }
    return groups;
};

