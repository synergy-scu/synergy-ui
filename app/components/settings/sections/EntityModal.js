import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Tab } from 'semantic-ui-react';

import EditPanes from './editor/EditPanes';
import EditTabContainer from './editor/EditTabContainer';

export class EntityModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    static propTypes = {
        showModal: PropTypes.bool,
        activeTab: PropTypes.number.isRequired,
        entityType: PropTypes.oneOf(['group', 'device', 'channel']).isRequired,
        changeTab: PropTypes.func.isRequired,
    };

    onTabChange = (event, { activeIndex }) => {
        this.props.changeTab(activeIndex);
    };

    render() {

        return (
            <Modal size='small' open={this.props.showModal}>
                <Modal.Header></Modal.Header>
                <Modal.Content>
                    <Tab
                        menu={{ secondary: true, pointing: true }}
                        panes={EditPanes.map(pane => {
                            const ConnectedPane = EditTabContainer(pane.component);
                            return {
                                menuItem: pane.menuItem,
                                render: () =>
                                    <Tab.Pane attached={false}>
                                        <ConnectedPane />
                                    </Tab.Pane>,
                            };
                        })}
                        activeIndex={this.props.activeTab}
                        onTabChange={this.onTabChange} />
                </Modal.Content>
                <Modal.Actions>

                </Modal.Actions>
            </Modal>
        );
    }
}
