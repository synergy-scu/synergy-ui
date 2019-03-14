import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Icon, Divider } from 'semantic-ui-react';

import { capitalize } from '../../api/utils';

export const EntityListing = props =>
    <div className='entity-listing'>
        {
            props.items.map((item, idx) => {
                const _changeActiveItem = () => props.changeActiveItem(item.uuid);
                const isActive = props.activeItem === item.uuid;
                return (
                    <React.Fragment key={item.uuid}>
                        <Segment basic
                            className='listing'
                            onClick={_changeActiveItem}
                            color={isActive ? 'olive' : null}
                            inverted={isActive}>

                            <span>
                                <Icon name='power' color='grey' />
                                {item.name || `Unnamed ${capitalize(props.entityType)}`}
                            </span>
                            <span>
                                <Icon link name='tachometer alternate' onClick={props.viewUsage} />
                                <Icon link name='bell' onClick={props.editNotifications} />
                                <Icon link name='edit' onClick={props.editItem} />
                            </span>
                        </Segment>
                        {idx !== props.items.length - 1 && <Divider />}
                    </React.Fragment>
                );
            })
        }
    </div>;

EntityListing.defaultProps = {
    changeActiveItem: () => null,
};

EntityListing.propTypes = {
    entityType: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            uuid: PropTypes.string,
            name: PropTypes.string,
            type: PropTypes.oneOf(['group', 'device', 'channel']),
        })
    ).isRequired,
    activeItem: PropTypes.string,
    changeActiveItem: PropTypes.func,
    viewUsage: PropTypes.func,
    editNotifications: PropTypes.func,
    editItem: PropTypes.func,
};
