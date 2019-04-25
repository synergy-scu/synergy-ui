import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createHashHistory';

import { loadState } from './localStorage';
import { default as Reducers } from './reducers';
import loggerMiddleware from './middleware/loggerMiddleware';
import { subscribeToStore } from './api/subscribeToStore';

const SynergyStore = () => {
    const history = createHistory();
    const initialState = loadState();

    const appReducers = {
        ...Reducers,
        routing: routerReducer,
    };

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(combineReducers(appReducers), initialState, composeEnhancers(applyMiddleware(thunk, routerMiddleware(history), loggerMiddleware)));

    subscribeToStore(store);

    return {
        history,
        store,
        dispatch: store.dispatch,
    };
};

export default SynergyStore();
