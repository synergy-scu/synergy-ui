import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';

import { genDevices, genGroups } from '../../api/data';

export class GroupsPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeGroup: this.props.groups.keys().next().value,
            activeMember: this.props.groups.values().next().value.members[0].uuid,
        };
    }

    static defaultProps = {
        groups: genGroups(8, genDevices(25)),
    };

    static propTypes = {
        groups: PropTypes.instanceOf(Map).isRequired,
    };

    setActiveGroup = group => {
        this.setState({
            activeGroup: group.groupID,
            activeMember: group.members[0].uuid,
        });
    };

    setActiveMember = memberID => {
        this.setState({
            activeMember: memberID,
        });
    };

    render() {
        const activeGroup = this.props.groups.get(this.state.activeGroup);
        return (
            <Grid>
                <Grid.Column width={4}>
                    <Segment.Group>
                        {
                            [...this.props.groups.values()].map((group, idx) => {
                                const isActive = group.groupID === this.state.activeGroup;
                                const _setActive = () => this.setActiveGroup(group);
                                return (
                                    <Segment
                                        key={`${group.groupID}.${idx}`}
                                        onClick={_setActive}
                                        inverted={isActive}
                                        color={isActive ? 'green' : null}
                                        content={group.name ? group.name : 'Unnamed Group'} />
                                );
                            }

                            )
                        }
                    </Segment.Group>
                </Grid.Column>

                <Grid.Column width={4}>
                    <Segment.Group>
                        {
                            activeGroup.members.map((member, idx) => {
                                const isActive = member.uuid === this.state.activeMember;
                                const _setActive = () => this.setActiveMember(member.uuid);
                                return (
                                    <Segment
                                        key={`${member.uuid}.${idx}`}
                                        onClick={_setActive}
                                        inverted={isActive}
                                        color={isActive ? 'olive' : null}
                                        content='Member Name' />
                                );
                            })
                        }
                    </Segment.Group>
                </Grid.Column>

                <Grid.Column width={8}>
                </Grid.Column>
            </Grid>
        );
    }
}
