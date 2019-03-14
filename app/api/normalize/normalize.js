export const normalizeGroup = ({ groupID, name, id, ...group }) => {
    // Extracting the 'id' so it doesnt get included in ...groups
    const entityTypes = ['channel', 'device', 'group'];
    const members = new Map();
    entityTypes.forEach(type => {
        group[`${type}s`].forEach(entity => {
            const uuid = entity[`${type}ID`];
            members.set(uuid, {
                uuid,
                name: entity.name,
                type,
            });
        });
    });

    return {
        name,
        groupID,
        members,
    };
};

export const normalizeDevice = ({ name, deviceID, channels, id, ...device }) => {
    // Extracting the 'id' so it doesnt get included in ...device
    return {
        name,
        deviceID,
        count: channels,
        channels: new Set(Object.values(device).filter(channel => Boolean(channel))),
    };
};

export const normalizeChannel = ({ name, channelID, deviceID, position }) => {
    return {
        name,
        channelID,
        deviceID,
        position,
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
        case 'devices':
            return normalizeDevice(data);
        case 'channels':
            return normalizeChannel(data);
        default:
            return {};
    }
};


