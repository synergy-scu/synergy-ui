import * as ApplicationReducers from './application';
import * as DataReducers from './data';
import * as SettingsReducers from './settings';
import * as UsageReducers from './usage';

export default {
    ...ApplicationReducers,
    ...DataReducers,
    ...SettingsReducers,
    ...UsageReducers,
};
