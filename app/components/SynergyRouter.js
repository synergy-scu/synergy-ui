import React from 'react';
import { Route, Switch, push as changePageAction } from 'react-router-dom';
import Loadable from 'react-loadable';

import { AppLoader } from './loadable/AppLoader';
import { AppError } from './loadable/AppError';

export const getLoader = ({ pastDelay, error, retry }) => {
    if (pastDelay) {
        return <AppLoader />;
    } else if (error) {
        return <AppError retry={retry} />;
    }
    return null;
};

export const createLoadable = path => Loadable({
    loader: () => import(path),
    loading: getLoader,
});

const AsyncSettingsPane = createLoadable('./settings/SettingsPaneContainer');
const AsyncChartsPane = createLoadable('./cards/ChartPaneContainer');

export const SynergyRouter = () =>
    <div id='router'>
        <Switch>
            <Route exact path='/' component={AsyncSettingsPane} />
            <Route exact path='/usage' component={AsyncChartsPane} />
            <Route exact path='/settings' component={AsyncSettingsPane} />
        </Switch>
    </div>;

