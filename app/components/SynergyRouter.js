import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, push as changePage } from 'react-router-dom';

import { RealTimeCumulative } from './cards/RealTimeCumulative';
import SettingsPaneContainer from './settings/SettingsPaneContainer';

const blank = () => <div />;

export const SynergyRouter = () =>
    <div id="router">
        <Switch>
            {/* <Route exact path='/' component={blank} /> */}
            <Route exact path="/" component={SettingsPaneContainer} />
            <Route exact path="/settings" component={SettingsPaneContainer} />
        </Switch>
    </div>;
SynergyRouter.propTypes = {
    history: PropTypes.any.isRequired,
};
