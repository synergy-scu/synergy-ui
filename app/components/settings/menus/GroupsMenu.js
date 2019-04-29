import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Accordion, Button, Icon, Modal } from 'semantic-ui-react';

import { EntityMenu } from '../sections/EntityMenu';
import { GroupAccordion } from '../sections/GroupAccordion';
import SettingsTabContainer from '../SettingsTabContainer';
import { AddMenu } from './AddMenu';

import { capitalize } from '../../../api/utils';
import { sortByStringProperty } from '../../../api/sort';

export class GroupsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expandedSection: [false, false, false],
            confirmDelete: false,
            isDeleting: false,
            isModalOpen: false,
        };
    }

    static propTypes = {
        entities: PropTypes.shape({
            groups: PropTypes.instanceOf(Map).isRequired,
            devices: PropTypes.instanceOf(Map).isRequired,
            channels: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
        activeGroup: PropTypes.string.isRequired,
        changeActiveGroup: PropTypes.func.isRequired,
    };

    handleTitleClick = (event, { index }) => {
        const expandedSection = [...this.state.expandedSection];
        expandedSection[index] = !expandedSection[index];
        this.setState({
            expandedSection,
        });
    };

    getMembers = group => {
        const result = {
            groups: [],
            devices: [],
            channels: [],
        };
        group.members.forEach(member => {
            const type = `${member.type}s`;
            const memberDetails = this.props.entities[type].get(member.uuid);
            result[type].push({
                ...memberDetails,
                uuid: member.uuid,
            });
        });
        return result;
    };

    deleteGroup = () => {
        if (!this.state.confirmDelete) {
            this.setState({
                confirmDelete: true,
            });
        } else {
            // this.props.deleteGroup();
            console.log('DELETE GROUP');
            this.setState({
                confirmDelete: false,
                isDeleting: true,
            });
        }
    };

    changeActiveGroup = itemID => {
        this.props.changeActiveGroup(itemID);
        this.setState({
            confirmDelete: false,
            isDeleting: false,
        });
    };

    toggleAddModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
        });
    };

    render() {
        const { groups } = this.props.entities;
        let activeGroup = null;
        let members = {};

        if (groups.size > 0) {
            activeGroup = groups.get(this.props.activeGroup);
            if (activeGroup) {
                members = this.getMembers(activeGroup);
                Object.values(members).forEach(entity => entity.sort(sortByStringProperty('name')));
            }
        }

        const AddMenuContainer = SettingsTabContainer(AddMenu);

        return (
            <Grid>
                <Grid.Column width={5} className="squarify">
                    <Modal centered
                        size='large'
                        open={this.state.isModalOpen}
                        closeOnDimmerClick={false}
                        closeOnEscape={false}
                        closeIcon={<Icon link name='close' onClick={this.toggleAddModal} />}
                        trigger={
                            <Button fluid
                                color='green'
                                content='Create New Group'
                                onClick={this.toggleAddModal}
                                style={{ marginBottom: '1em' }} />
                        }>
                        <Modal.Header>Create Group</Modal.Header>
                        <Modal.Content scrolling>
                            <AddMenuContainer groupType='group' />
                        </Modal.Content>
                    </Modal>
                    <EntityMenu
                        entityType="group"
                        activeItem={this.props.activeGroup}
                        items={groups}
                        setActiveItem={this.changeActiveGroup} />
                </Grid.Column>

                <Grid.Column width={11} className="squarify">
                    {
                        activeGroup &&
                            <Segment.Group>
                                <Segment className='split'>
                                    <span>{activeGroup.name}</span>
                                    <Button icon compact
                                        loading={this.state.isDeleting}
                                        labelPosition={this.state.confirmDelete ? 'right' : null}
                                        color={this.state.confirmDelete ? 'red' : null}
                                        onClick={this.deleteGroup}>
                                        {
                                            this.state.confirmDelete && 'Confirm'
                                        }
                                        <Icon name={this.state.confirmDelete ? 'warning circle' : 'trash alternate outline'} />
                                    </Button>
                                </Segment>
                                <Segment>
                                    <Accordion>
                                        {
                                            Object.entries(members).map(([entity, items], idx) =>
                                                Boolean(items.length) &&
                                                    <GroupAccordion
                                                        key={entity}
                                                        index={idx}
                                                        isActive={this.state.expandedSection[idx]}
                                                        title={capitalize(entity)}
                                                        items={items}
                                                        handleTitleClick={this.handleTitleClick} />
                                            )
                                        }
                                    </Accordion>
                                </Segment>
                            </Segment.Group>
                    }
                </Grid.Column>
            </Grid>
        );
    }
}
