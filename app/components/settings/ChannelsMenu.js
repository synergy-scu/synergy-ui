import React from 'react';
import PropTypes from 'prop-types';

import { EntityListing } from './EntityListing';

export const ChannelsMenu = props =>
    <div className='squarify'>
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
    </div>;

ChannelsMenu.propTypes = {
    entities: PropTypes.shape({
        groups: PropTypes.instanceOf(Map).isRequired,
        devices: PropTypes.instanceOf(Map).isRequired,
        channels: PropTypes.instanceOf(Map).isRequired,
    }).isRequired,
    activeChannel: PropTypes.string.isRequired,
    changeActiveChannel: PropTypes.func.isRequired,
};

