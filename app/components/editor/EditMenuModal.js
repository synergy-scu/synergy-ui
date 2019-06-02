import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'semantic-ui-react';
import { capitalize } from 'lodash';

import EditMenuContainer from './EditMenuContainer';

export const EditMenuModal = props => {
    const openButtonMessage = props.menuType === 'create'
        ? `${capitalize(props.menuType)} New ${capitalize(props.groupType)}`
        : `${capitalize(props.menuType)} ${capitalize(props.groupType)}`;

    return (
        <Modal centered
            size='large'
            open={props.isOpen}
            closeOnDimmerClick={false}
            closeOnEscape={false}
            closeIcon={<Icon link name='close' onClick={props.toggleModal} />}
            trigger={
                props.isChart
                    ? <Button fluid
                        icon='edit'
                        color='green'
                        onClick={props.toggleModal}
                        style={{ marginTop: '1em' }} />
                    : <Button fluid
                        color='green'
                        content={openButtonMessage}
                        onClick={props.toggleModal}
                        style={{ marginBottom: '1em' }} />
            }>
            <Modal.Header>{`${capitalize(props.menuType)} ${capitalize(props.groupType)}`}</Modal.Header>
            <Modal.Content scrolling>
                <EditMenuContainer isModal
                    uuid={props.uuid}
                    menuType={props.menuType}
                    groupType={props.groupType}
                    toggleModal={props.toggleModal} />
            </Modal.Content>
        </Modal>
    );
};

EditMenuModal.defaultProps = {
    isOpen: false,
    isChart: false,
    uuid: '',
};

EditMenuModal.propTypes = {
    isChart: PropTypes.bool,
    isOpen: PropTypes.bool,
    uuid: PropTypes.string,
    menuType: PropTypes.oneOf(['create', 'update']).isRequired,
    groupType: PropTypes.oneOf(['group', 'chart']).isRequired,
    toggleModal: PropTypes.func.isRequired,
};
