import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './Store';
import createHistory from 'history/createHashHistory';

// import { Heading } from './components/Heading';
// import { SynergyRouter } from './components/UMPRouter';
// import { Sidebar } from './components/sidebar/Sidebar';
import ApplicationContainer from './components/containers/ApplicationContainer';

const history = createHistory();
const store = configureStore(loadState(), history);

const routes = [
    { icon: 'pie chart', name: 'Cumulative', path: 'cumulative' },
    { icon: 'tachometer alternate', name: 'Devices', path: 'devices' },
    { icon: 'calendar outline', name: 'History', path: 'history' },
    { icon: 'cog', name: 'Settings', path: 'settings' },
];

render(
    <Provider store={store}>
        <Heading />
        <div id='router'>
            <Router history={history}>
                <ApplicationContainer menu={<Sidebar routes={routes} user={store.user} />} application={<SynergyRouter history={history} />} />
            </Router>
        </div>
    </Provider>,
    document.getElementById('app')
);

if (module.hot) {
    module.hot.accept('./components/Application', () => {
        // eslint-disable-next-line global-require
        const HotApplicationContainer = require('./components/containers/ApplicationContainer').default;
        render(<HotApplicationContainer menu={<Sidebar routes={routes} user={store.user} />} application={<SynergyRouter history={history} />} />,
            document.getElementById('app'));
    });
}