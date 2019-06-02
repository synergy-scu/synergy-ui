import 'map.prototype.tojson';
import 'set.prototype.tojson';

import React from 'react';
import Axios from 'axios';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AxiosProvider } from 'react-axios';

import SynergyStore from './Store';
import { Heading } from './components/Heading';
import ApplicationContainer from './components/ApplicationContainer';
import UserHandlerContainer from './components/login/UserHandlerContainer';
import ActionCreators from './actions';

import 'semantic-ui-css/semantic.min.css';
import 'react-dates/lib/css/_datepicker.css';

import 'react-dates/initialize';
import 'json.date-extensions';

const store = SynergyStore.store;
const history = SynergyStore.history;
const instance = Axios.create({
    baseURL: '/api/',
    timeout: 600000,
    method: 'post',
    transformResponse: [data => Object.values(JSON.parse(data))[0]],
});

// store.dispatch(ActionCreators.fetchAll({ axios: instance }));
store.dispatch(ActionCreators.toggleLoginModal(true));

render(
    <AxiosProvider instance={instance}>
        <Provider store={store}>
            <Router history={history}>
                <React.Fragment>
                    <UserHandlerContainer />
                    <Heading />
                    <ApplicationContainer history={history} />
                </React.Fragment>
            </Router>
        </Provider>
    </AxiosProvider>,
    document.getElementById('app')
);

if (module.hot) {
    module.hot.accept('./components/Application', () => {
        // eslint-disable-next-line global-require
        const HotApplicationContainer = require('./components/ApplicationContainer').default;
        render(<HotApplicationContainer history={history} />,
            document.getElementById('app'));
    });
}
