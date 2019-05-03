import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Header } from 'semantic-ui-react';

export const Heading = () =>
    <Grid id='heading' columns={2}>
        <Grid.Column className='heading-sidebar' width={1}>
            <Link to='/user'>
                <Icon link inverted name='user' size='large' />
            </Link>
        </Grid.Column>
        <Grid.Column width={15}>
            <Header as='h1' content='Synergy' />
        </Grid.Column>
    </Grid>;
