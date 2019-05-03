import Actions from '../actions';
import { normalize, extractChannels } from '../api/normalize/normalize';
import { fetchAllRequest, entityRequest, fetchRequest } from '../api/requests';
import RequestStates from '../api/constants/RequestStates';

export const isLoadingQuery = (state = false, action) => {
    switch (action.type) {
        case Actions.FETCH_NEW:
        case Actions.FETCH_ALL_NEW:
            return true;
        case Actions.FETCH_FINISH:
        case Actions.FETCH_ALL_FINISH:
            return false;
        default:
            return state;
    }
};

export const currentRequest = (state = fetchAllRequest({}), action) => {
    const now = new Date().getTime();
    switch (action.type) {
        case Actions.FETCH_ALL_NEW:
            return fetchAllRequest({
                id: action.payload.requestID,
                start: now,
            });
        case Actions.FETCH_ALL_NEW_ENTITY: {
            const entityType = action.payload.entityType;
            return fetchAllRequest({
                ...state,
                status: {
                    ...state.status,
                    [entityType]: entityRequest({
                        id: action.payload.requestID,
                        start: now,
                        requests: action.payload.requests,
                        type: entityType,
                    }),
                },
            });
        }
        case Actions.FETCH_ALL_START: {
            const entityType = action.payload.entityType;
            const requestedEntity = state.status[entityType];
            return fetchAllRequest({
                ...state,
                requests: state.requests + 1,
                status: {
                    ...state.status,
                    [entityType]: entityRequest({
                        ...requestedEntity,
                        phase: RequestStates.LOADING,
                        status: {
                            ...requestedEntity.status,
                            [action.payload.offset]: fetchRequest({
                                id: action.payload.requestID,
                                start: now,
                                phase: RequestStates.LOADING,
                                type: entityType,
                            }),
                        },
                    }),
                },
                phase: RequestStates.LOADING,
            });
        }
        case Actions.FETCH_ALL_SUCCESS: {
            const entityType = action.payload.entityType;
            const requestedEntity = state.status[entityType];
            const requestedFetch = requestedEntity.status[action.payload.offset];
            return fetchAllRequest({
                ...state,
                status: {
                    ...state.status,
                    [entityType]: entityRequest({
                        ...requestedEntity,
                        total: requestedEntity.total + action.payload.data.length,
                        status: {
                            ...requestedEntity.status,
                            [action.payload.offset]: fetchRequest({
                                ...requestedFetch,
                                end: now,
                                time: now - requestedFetch.start,
                                count: action.payload.data.length,
                                phase: RequestStates.SUCCESS,
                            }),
                        },
                    }),
                },
            });
        }
        case Actions.FETCH_ALL_ERROR: {
            const entityType = action.payload.entityType;
            const requestedEntity = state.status[entityType];
            const requestedFetch = requestedEntity.status[action.payload.offset];
            return fetchAllRequest({
                ...state,
                status: {
                    ...state.status,
                    [entityType]: entityRequest({
                        ...requestedEntity,
                        errors: requestedEntity.errors.concat([action.payload.error]),
                        status: {
                            ...requestedEntity.status,
                            [action.payload.offset]: fetchRequest({
                                ...requestedFetch,
                                end: now,
                                time: now - requestedFetch.start,
                                phase: RequestStates.ERROR,
                                error: action.payload.error,
                            }),
                        },
                    }),
                },
            });
        }
        case Actions.FETCH_ALL_FINISH_ENTITY: {
            const entityType = action.payload.entityType;
            const requestedEntity = state.status[entityType];
            return fetchAllRequest({
                ...state,
                status: {
                    ...state.status,
                    [entityType]: entityRequest({
                        ...requestedEntity,
                        end: now,
                        time: now - requestedEntity.start,
                        phase: RequestStates.FINISHED,
                    }),
                },
            });
        }
        case Actions.FETCH_ALL_FINISH: {
            return fetchAllRequest({
                ...state,
                end: now,
                time: now - state.start,
                phase: RequestStates.FINISHED,
            });
        }
        default:
            return state;
    }
};

const defaultEntities = { groups: new Map(), devices: new Map(), channels: new Map(), charts: new Map() };
export const entities = (state = defaultEntities, action) => {
    switch (action.type) {
        case Actions.FETCH_ENTITY_SUCCESS:
        case Actions.FETCH_ALL_SUCCESS: {
            const items = new Map(state[action.payload.entityType]);

            switch (action.payload.entityType) {
                case 'channels':
                case 'devices':
                    if (Array.isArray(action.payload.data)) {
                        action.payload.data.forEach(entity => {
                            const normalizedEntity = normalize(entity, action.payload.entityType);
                            items.set(normalizedEntity.key, normalizedEntity);
                        });

                        return {
                            ...state,
                            [action.payload.entityType]: items,
                        };
                    }
                    return state;
                case 'groups':
                case 'charts':

                    if (Array.isArray(action.payload.data[action.payload.entityType])) {
                        action.payload.data[action.payload.entityType].forEach(parent => {
                            const normalizedEntity = normalize(parent, action.payload.entityType);
                            items.set(normalizedEntity.key, normalizedEntity);
                        });
                    }

                    if (Array.isArray(action.payload.data.members)) {
                        action.payload.data.members.forEach(member => {
                            const parent = items.get(member[action.payload.entityType === 'groups' ? 'groupID' : 'chartID']);
                            parent.members.push(normalize(member, action.payload.entityType === 'groups' ? 'groupling' : 'chartling'));
                            items.set(parent.key, parent);
                        });
                    }
                    return {
                        ...state,
                        [action.payload.entityType]: items,
                    };
                default:
                    return state;
            }
        }
        case Actions.FETCH_ALL_FINISH:
        case Actions.EXTRACT_ALL_CHANNELS: {
            const devices = new Map(state.devices);
            state.devices.forEach(device => {
                const channels = [...state.channels.values()].filter(channel => channel.deviceID === device.deviceID);
                devices.set(device.deviceID, {
                    ...device,
                    channels,
                    extracted: new Set(channels.map(channel => channel.uuid)),
                });
            });

            const groups = new Map(state.groups);
            state.groups.forEach(group => {
                groups.set(group.groupID, {
                    ...group,
                    extracted: extractChannels(group, {
                        ...state,
                        devices,
                    }),
                });
            });

            const charts = new Map(state.charts);
            state.charts.forEach(chart => {
                charts.set(chart.chartID, {
                    ...chart,
                    extracted: extractChannels(chart, {
                        ...state,
                        devices,
                        groups,
                    }),
                });
            });

            return {
                ...state,
                devices,
                groups,
                charts,
            };
        }
        case Actions.EXTRACT_CHANNELS: {
            const items = new Map(state[action.payload.entityType]);

            switch (action.payload.entityType) {
                case 'groups':
                case 'charts': {
                    const item = items.get(action.payload.uuid);
                    items.set(action.payload.uuid, {
                        ...item,
                        extracted: extractChannels(item, state),
                    });
                    return {
                        ...state,
                        [action.payload.entityType]: items,
                    };
                }
                case 'devices': {
                    const item = items.get(action.payload.uuid);
                    const channels = [...state.channels.values()].filter(channel => channel.deviceID === action.payload.uuid);

                    items.set(action.payload.uuid, {
                        ...item,
                        channels,
                        extracted: new Set(channels.map(channel => channel.uuid)),
                    });

                    return {
                        ...state,
                        [action.payload.entityType]: items,
                    };
                }
                default:
                    return state;
            }
        }
        default:
            return state;
    }
};

export const errors = (state = [], action) => {
    switch (action.type) {
        case Actions.FETCH_ERROR:
        case Actions.FETCH_ALL_ERROR:
            return state.concat([action.payload.error]);
        default:
            return state;
    }
};
