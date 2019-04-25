import * as ApplicationReducers from './application';
import * as AuthReducers from './authentication';
import * as DataReducers from './data';
import * as SettingsReducers from './settings';
import * as StreamReducers from './streams';
import * as UsageReducers from './usage';

export default {
    ...ApplicationReducers,
    ...AuthReducers,
    ...DataReducers,
    ...SettingsReducers,
    ...StreamReducers,
    ...UsageReducers,
};
