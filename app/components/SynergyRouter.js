import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, push as changePage } from 'react-router-dom';
import Loadable from 'react-loadable';

import { UsageTypes } from '../api/constants/ChartTypes';
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

getLoader.propTypes = {
    pastDelay: PropTypes.bool,
    error: PropTypes.bool,
    retry: PropTypes.func,
};

export const createLoadable = (path, props = null) => {
    const loadable = {
        loader: () => import(path),
        loading: getLoader,
    };

    if (props) {
        // eslint-disable-next-line react/display-name
        loadable.render = (loaded, ownProps) => {
            const Component = loaded.default;
            return <Component {...props} {...ownProps} />;
        };
    }

    return Loadable(loadable);
};

const AsyncLoaderPane = createLoadable('./loadable/AppLoader');
const AsyncSettingsPane = createLoadable('./settings/SettingsPaneContainer');
const AsyncChartsPane = createLoadable('./cards/ChartPaneContainer', { usageType: UsageTypes.REALTIME });
const AsyncHistoryPane = createLoadable('./cards/ChartPaneContainer', { usageType: UsageTypes.HISTORICAL });

export const SynergyRouter = () =>
    <Switch>
        <Route exact path='/' component={AsyncLoaderPane} />
        <Route exact path='/home' component={AsyncChartsPane} />
        <Route exact path='/history' component={AsyncHistoryPane} />
        <Route exact path='/settings' component={AsyncSettingsPane} />
    </Switch>;

