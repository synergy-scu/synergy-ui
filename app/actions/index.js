import { default as Actions } from './types';

import * as ApplicationActions from './application';
import * as UserActions from './application';
import * as QueryAllActions from './queryAll';
import * as EntityActions from './entities';
import * as SettingsActions from './settings';
import * as UsageActions from './usage';

export default {
    ...Actions,
    ...ApplicationActions,
    ...UserActions,
    ...QueryAllActions,
    ...EntityActions,
    ...SettingsActions,
    ...UsageActions,
};
