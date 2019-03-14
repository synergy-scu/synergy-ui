import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Accordion } from 'semantic-ui-react';

import { capitalize } from '../../api/utils';
import { EntityAccordion } from './EntityAccordion';

export class GroupsCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expandedSection: [false, false, false],
        };
    }

    static propTypes = {
        name: PropTypes.string.isRequired,
        members: PropTypes.objectOf(
            PropTypes.arrayOf(
                PropTypes.shape({
                    uuid: PropTypes.string.isRequired,
                    name: PropTypes.string,
                    type: PropTypes.oneOf(['group', 'device', 'channel']).isRequired,
                })
            )
        ).isRequired,
    };

    handleTitleClick = (event, { index }) => {
        const expandedSection = [...this.state.expandedSection];
        expandedSection[index] = !expandedSection[index];
        this.setState({
            expandedSection,
        });
    };

    render() {

        return (
            <Segment.Group>
                <Segment>
                    {this.props.name}
                </Segment>
                <Segment>
                    <Accordion>
                        {
                            Object.entries(this.props.members).map(([entity, items], idx) =>
                                Boolean(items.length) &&
                                    <EntityAccordion
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
        );
    }
}
