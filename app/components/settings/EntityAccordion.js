import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon, Label } from 'semantic-ui-react';
import { EntityListing } from './EntityListing';

export const EntityAccordion = props =>
    <React.Fragment>
        <Accordion.Title active={props.isActive} index={props.index} onClick={props.handleTitleClick}>
            <div className='left'>
                <Icon name='dropdown' />
                {props.title}
            </div>
            <Label size='mini' content={props.items.length} />
        </Accordion.Title>
        <Accordion.Content active={props.isActive}>
            <EntityListing
                entityType={props.title.substring(0, props.title.length - 1)}
                items={props.items}
                viewUsage={props.viewUsage}
                editNotifications={props.editNotifications}
                editItem={props.editItem} />
        </Accordion.Content>
    </React.Fragment>;

EntityAccordion.defaultProps = {
    isActive: true,
};

EntityAccordion.propTypes = {
    isActive: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        name: PropTypes.string,
        type: PropTypes.oneOf(['group', 'device', 'channel']).isRequired,
    })).isRequired,
    handleTitleClick: PropTypes.func.isRequired,
    viewUsage: PropTypes.func,
    editNotifications: PropTypes.func,
    editItem: PropTypes.func,
};
