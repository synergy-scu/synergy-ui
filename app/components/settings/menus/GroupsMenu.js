import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Accordion } from 'semantic-ui-react';

import { EntityMenu } from '../sections/EntityMenu';
import { GroupAccordion } from '../sections/GroupAccordion';

import { capitalize } from '../../../api/utils';
import { sortByStringProperty } from '../../../api/sort';

export class GroupsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expandedSection: [false, false, false],
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
            if (member.type === 'group') {
                result.groups.push(member);
            } else if (member.type === 'device') {
                result.devices.push(member);
            } else if (member.type === 'channel') {
                result.channels.push(member);
            }
        });
        return result;
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

        return (
            <Grid>
                <Grid.Column width={5} className="squarify">
                    <EntityMenu entityType="group" activeItem={this.props.activeGroup} items={groups} setActiveItem={this.props.changeActiveGroup} />
                </Grid.Column>

                <Grid.Column width={11} className="squarify">
                    {
                        activeGroup &&
                            <Segment.Group>
                                <Segment>
                                    {activeGroup.name}
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
