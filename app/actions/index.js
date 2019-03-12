import { default as Actions } from './types';

import * as ApplicationActions from './application';
import * as UserActions from './application';
import * as QueryAllActions from './queryAll';

export default {
    ...Actions,
    ...ApplicationActions,
    ...UserActions,
    ...QueryAllActions,
};
