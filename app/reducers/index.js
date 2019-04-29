import * as ApplicationReducers from './application';
import * as AuthReducers from './authentication';
import * as ChartReducers from './charts';
import * as DataReducers from './data';
import * as ErrorReducers from './errors';
import * as RequestReducers from './requests';
import * as SettingsReducers from './settings';
import * as StreamReducers from './streams';
import * as UsageReducers from './usage';

export default {
    ...ApplicationReducers,
    ...AuthReducers,
    ...ChartReducers,
    ...DataReducers,
    ...ErrorReducers,
    ...RequestReducers,
    ...SettingsReducers,
    ...StreamReducers,
    ...UsageReducers,
};
