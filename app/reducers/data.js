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

const defaultEntities = { groups: new Map(), devices: new Map(), channels: new Map() };
export const entities = (state = defaultEntities, action) => {
    switch (action.type) {
        case Actions.FETCH_ALL_SUCCESS:
            if (Array.isArray(action.payload.data)) {
                const entityName = action.payload.entityType.substring(0, action.payload.entityType.length - 1);
                action.payload.data.forEach(entity => {
                    const normalizedEntity = normalize(entity, action.payload.entityType);
                    state[action.payload.entityType].set(entity[entityName.concat('ID')], normalizedEntity);
                });
            }
            return { ...state };
        case Actions.FETCH_SUCCESS:
            return state;
        case Actions.EXTRACT_CHANNELS: {
            action.payload.groups.forEach(group => {
                state.groups.set(group.groupID, {
                    ...group,
                    extracted: extractChannels(group, state),
                });
            });
            return { ...state };
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
