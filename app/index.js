import React from 'react';
import Axios from 'axios';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AxiosProvider } from 'react-axios';
import CssBaseline from '@material-ui/core/CssBaseline';

import SynergyStore from './Store';
// import { Heading } from './components/Heading';
// import ApplicationContainer from './components/ApplicationContainer';
// import UserHandlerContainer from './components/login/UserHandlerContainer';

const store = SynergyStore.store;
const history = SynergyStore.history;
const instance = Axios.create({
    baseURL: '/api/',
    timeout: 5000,
    method: 'post',
});

render(
    <AxiosProvider instance={instance}>
        <Provider store={store}>
            <Router history={history}>
                <React.Fragment>
                    <CssBaseline />
                    {/* <UserHandlerContainer /> */}
                    {/* <Heading /> */}
                    {/* <ApplicationContainer history={history} /> */}
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
