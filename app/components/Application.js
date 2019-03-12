import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

import { SynergyRouter } from './SynergyRouter';
import { Navigation } from './navigation/Navigation';

import Routes from '../api/Routes';

export class Application extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        user: PropTypes.string,
        history: PropTypes.object,
    };

    render = () =>
        <Grid className='app-frame' columns={2}>
            <Grid.Column className='nav-sidebar' width={1}>
                <Navigation routes={Routes} user={this.props.user} />
            </Grid.Column>
            <Grid.Column width={15} stretched style={{ paddingTop: '0.25em' }}>
                <SynergyRouter history={this.props.history} />
            </Grid.Column>
        </Grid>;
}
