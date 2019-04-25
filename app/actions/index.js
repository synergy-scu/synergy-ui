import { default as Actions } from './types';

import * as DisplayActions from './display';
import * as EntityActions from './entities';
import * as GroupActions from './groups';
import * as LoginActions from './login';
import * as QueryAllActions from './queryAll';
import * as SettingsActions from './settings';
import * as StreamActions from './stream';
import * as UsageActions from './usage';
import * as UserActions from './users';

export default {
    ...Actions,
    ...DisplayActions,
    ...EntityActions,
    ...GroupActions,
    ...LoginActions,
    ...QueryAllActions,
    ...SettingsActions,
    ...StreamActions,
    ...UsageActions,
    ...UserActions,
};
