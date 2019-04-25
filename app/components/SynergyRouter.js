import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, push as changePage } from 'react-router-dom';

import ChartPaneContainer from './cards/ChartPaneContainer';
import SettingsPaneContainer from './settings/SettingsPaneContainer';

export const SynergyRouter = () =>
    <div id="router">
        <Switch>
            <Route exact path='/usage' component={ChartPaneContainer} />
            <Route exact path="/" component={SettingsPaneContainer} />
            <Route exact path="/settings" component={SettingsPaneContainer} />
        </Switch>
    </div>;
SynergyRouter.propTypes = {
    history: PropTypes.any.isRequired,
};
