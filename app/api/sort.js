import { get } from 'lodash';

export const sortByStringProperty = property => (entityA, entityB) =>
    get(entityA, property, '').toLowerCase().localeCompare(get(entityB, property, '').toLowerCase());

export const sortByNumericProperty = property => (entityA, entityB) =>
    get(entityA, property, 0) > get(entityB, property, 0) ? 1 : -1;

export const sortMap = {
    channelID: entity => get(entity, 'channelID', ''),
    deviceID: entity => get(entity, 'deviceID', ''),
    groupID: entity => get(entity, 'groupID', ''),
    userID: entity => get(entity, 'userID', ''),
    chartID: entity => get(entity, 'chartID', ''),
    uuid: entity => get(entity, 'uuid', ''),

    name: entity => get(entity, 'name', ''),
    type: entity => get(entity, 'type', ''),
    members: entity => get(entity, 'members', 0),
    channels: entity => get(entity, 'channels', 0),

    amps: entity => get(entity, 'amps', 0),
    time: entity => get(entity, 'time', new Date()),
    chartType: entity => get(entity, 'chartType', ''),
    usageType: entity => get(entity, 'usageType', ''),

    email: entity => get(entity, 'email', ''),
    family_size: entity => get(entity, 'family_size', 0),

    created: entity => get(entity, 'created', new Date()),
    updated: entity => get(entity, 'updated', new Date()),
    added: entity => get(entity, 'added', new Date()),
    from: entity => get(entity, 'from', new Date()),
    until: entity => get(entity, 'until', new Date()),
};

export const getSortFunctions = fields => fields.map(sortee => sortMap[sortee]);
