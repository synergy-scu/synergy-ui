import Actions from '../actions';

export const isLoadingQuery = (state = false, action) => {
    switch (action.type) {
        case Actions.FETCH_NEW:
        case Actions.FETCH_NEW_ALL:
            return true;
        case Actions.FETCH_FINISH:
        case Actions.FETCH_FINISH_ALL:
            return false;
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
                    state[action.payload.entityType].set(entity[entityName.concat('ID')], entity);
                });
            }
            console.log(state);
            return { ...state };
        case Actions.FETCH_SUCCESS:
            return state;
        default:
            return state;
    }
};

export const errors = (state = [], action) => {
    switch (action.type) {
        case Actions.FETCH_ERROR:
        case Actions.FETCH_ERROR_ALL:
            return state.concat([action.payload.error]);
        default:
            return state;
    }
};
