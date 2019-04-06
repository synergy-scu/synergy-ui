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

const store = SynergyStore.store;
const history = SynergyStore.history;
const instance = Axios.create({
    baseURL: '/api/',
    timeout: 30000,
    method: 'post',
});

store.dispatch(ActionCreators.fetchAll({ axios: instance }));

render(
    <AxiosProvider instance={instance}>
        <Provider store={store}>
            <Router history={history}>
                <React.Fragment>
                    <UserHandlerContainer isOpen={false} />
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
