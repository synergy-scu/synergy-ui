import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createHashHistory';

import { loadState, saveState } from './localStorage';
import { default as Reducers } from './reducers';
import loggerMiddleware from './middleware/loggerMiddleware';

const SynergyStore = () => {
    const history = createHistory();
    const initialState = loadState();

    const appReducers = {
        user: Reducers.user,
        routing: routerReducer,

        isLoadingQuery: Reducers.isLoadingQuery,
        currentRequest: Reducers.currentRequest,
        entities: Reducers.entities,
        errors: Reducers.errors,

        settingsTab: Reducers.settingsTab,
        activeGroup: Reducers.activeGroup,
        activeDevice: Reducers.activeDevice,
        activeChannel: Reducers.activeChannel,

        editTab: Reducers.editTab,
        showEditModal: Reducers.showEditModal,

        cumulative: Reducers.cumulative,
    };

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(combineReducers(appReducers), initialState, composeEnhancers(applyMiddleware(thunk, routerMiddleware(history), loggerMiddleware)));

    return {
        history,
        store,
    };
};

export default SynergyStore();
