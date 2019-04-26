import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

import { SynergyRouter } from './SynergyRouter';
import { Navigation } from './navigation/Navigation';

import Routes from '../api/constants/Routes';

export class Application extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        user: PropTypes.shape({
            userID: PropTypes.number,
            name: PropTypes.string,
            email: PropTypes.string,
        }).isRequired,
        history: PropTypes.object,
    };

    render = () =>
        <Grid className='app-frame' columns={2}>
            <Grid.Column className='nav-sidebar' width={1}>
                <Navigation routes={Routes} user={this.props.user} />
            </Grid.Column>
            <Grid.Column width={15} stretched id='router'>
                <SynergyRouter history={this.props.history} />
            </Grid.Column>
        </Grid>;
}
