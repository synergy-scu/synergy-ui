import * as ApplicationReducers from './application';
import * as DataReducers from './data';
import * as SettingsReducers from './settings';

export default {
    ...ApplicationReducers,
    ...DataReducers,
    ...SettingsReducers,
};
