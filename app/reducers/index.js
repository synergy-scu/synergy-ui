import { combineReducers } from 'redux';

import { UsageTypes } from '../api/constants/ChartTypes';

import * as ApplicationReducers from './application';
import * as AuthReducers from './authentication';
import * as DataReducers from './data';
import * as ErrorReducers from './errors';
import * as RequestReducers from './requests';
import * as SettingsReducers from './settings';
import * as StreamReducers from './streams';
import * as UsageReducers from './usage';
import ChartReducers from './charts';

export default {
    ...ApplicationReducers,
    ...AuthReducers,
    realtime: combineReducers({ ...ChartReducers(UsageTypes.REALTIME) }),
    historical: combineReducers({ ...ChartReducers(UsageTypes.HISTORICAL) }),
    ...DataReducers,
    ...ErrorReducers,
    ...RequestReducers,
    ...SettingsReducers,
    ...StreamReducers,
    ...UsageReducers,
};
