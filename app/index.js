import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import SynergyStore from './Store';

// import { Heading } from './components/Heading';
import ApplicationContainer from './components/ApplicationContainer';

const store = SynergyStore.store;
const history = SynergyStore.history;

render(
    <Provider store={store}>
        {/* <Heading /> */}
        <div id='router'>
            <Router history={history}>
                <ApplicationContainer history={history} />
            </Router>
        </div>
    </Provider>,
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
