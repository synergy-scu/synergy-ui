import React from 'react';
import { Route, Switch, push } from 'react-router-dom';

const tempComponent = () => <div></div>;

export const SynergyRouter = () =>
    <div id='router'>
        <Switch>
            <Route exact path='/' component={tempComponent} />
            {/* <Route exact path='/settings' component={} /> */}
        </Switch>
    </div>;
