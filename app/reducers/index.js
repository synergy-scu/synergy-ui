import * as ApplicationReducers from './application';
import * as DataReducers from './data';

export default {
    ...ApplicationReducers,
    ...DataReducers,
};
