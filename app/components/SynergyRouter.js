import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, push as changePage } from 'react-router-dom';

import { RealTimeCumulative } from './cards/RealTimeCumulative';
import { SettingsPane } from './settings/SettingsPane';

const blank = () => <div />;

export const SynergyRouter = () =>
    <div id='router'>
        <Switch>
            {/* <Route exact path='/' component={blank} /> */}
            <Route exact path='/' component={SettingsPane} />
            <Route exact path='/settings' component={SettingsPane} />
        </Switch>
    </div>;

SynergyRouter.propTypes = {
    history: PropTypes.any.isRequired,
};
