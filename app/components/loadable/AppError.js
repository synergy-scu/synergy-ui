import React from 'react';
import { Dimmer, Header, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export const AppError = props =>
    <Dimmer active>
        <Header
            as='h2'
            inverted
            content='There was an error loading Synergy'
            subheader='Please reload the page' />
        <Button onClick={props.retry} color='green'>Reload</Button>
    </Dimmer>;

AppError.propTypes = {
    retry: PropTypes.func.isRequired,
};
