export { default as Actions } from './types';

import * as ApplicationActions from './application';
import * as UserActions from './application';

export default {
    ...ApplicationActions,
    ...UserActions,
};
