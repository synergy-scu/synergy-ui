import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

import { EntityListing } from '../sections/EntityListing';

export const ChannelsMenu = props =>
    <Container text className='squarify'>
        <EntityListing
            entityType='channel'
            activeItem={props.activeChannel}
            changeActiveItem={props.changeActiveChannel}
            items={[...props.entities.channels.values()]
                .map(channel => {
                    return {
                        uuid: channel.channelID,
                        name: channel.name,
                    };
                })} />
    </Container>;

ChannelsMenu.propTypes = {
    entities: PropTypes.shape({
        groups: PropTypes.instanceOf(Map).isRequired,
        devices: PropTypes.instanceOf(Map).isRequired,
        channels: PropTypes.instanceOf(Map).isRequired,
    }).isRequired,
    activeChannel: PropTypes.string.isRequired,
    changeActiveChannel: PropTypes.func.isRequired,
};

