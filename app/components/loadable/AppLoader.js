import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export const AppLoader = () =>
    <Dimmer active>
        <Loader inline='centered' />
    </Dimmer>;

export default AppLoader;
