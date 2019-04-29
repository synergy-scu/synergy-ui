import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Container, Icon, Header } from 'semantic-ui-react';

export const Heading = () =>
    <Grid id='heading' columns={2}>
        <Grid.Column className='heading-sidebar' width={1} />
        <Grid.Column width={15}>
            <Header as='h1' content='Synergy' />
            {/* <Container className='user'>
                <Link to='/user'>
                    <Icon inverted link name='user' />
                </Link>
            </Container> */}
        </Grid.Column>
    </Grid>;
