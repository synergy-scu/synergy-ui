import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import { capitalize } from '../../api/utils';

export const EntityMenu = props =>
    <Segment.Group>
        {
            [...props.items.values()].map(item => {
                const itemID = item[`${props.entityType}ID`];
                const isActive = itemID === props.activeItem;
                const _setActive = () => props.setActiveItem(itemID);
                return (
                    <Segment
                        key={itemID}
                        onClick={_setActive}
                        inverted={isActive}
                        color={isActive ? 'green' : null}
                        content={item.name ? item.name : `Unnamed ${capitalize(props.entityType)}`} />
                );
            })
        }
    </Segment.Group>;

EntityMenu.propTypes = {
    entityType: PropTypes.oneOf(['group', 'device', 'channel']).isRequired,
    activeItem: PropTypes.string.isRequired,
    items: PropTypes.instanceOf(Map).isRequired,
    setActiveItem: PropTypes.func.isRequired,
};
