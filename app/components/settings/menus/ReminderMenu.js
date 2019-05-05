import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import moment from 'moment';
import { escapeRegExp, filter, debounce } from 'lodash';
import { Grid, Segment, Table, Checkbox, Input } from 'semantic-ui-react';
import { isDeepStrictEqual } from 'util';

import { ReminderForm } from '../sections/reminders/ReminderForm';

export class ReminderMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false,
            search: '',
        };
    }

    static propTypes = {
        entities: PropTypes.shape({
            channels: PropTypes.instanceOf(Map).isRequired,
            reminders: PropTypes.instanceOf(Map).isRequired,
        }),
        createReminder: PropTypes.func.isRequired,
    };

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
        });
    };

    onSearch = (event, { value }) => {
        this.setState({
            search: value,
        });
    };

    isMatch = value => result => {
        const re = new RegExp(escapeRegExp(value), 'i');
        if (value.length) {
            return re.test(result.channel.name) && Boolean(result.channel.name);
        }
        return re.test(result.channel.name);
    };

    filterReminders = memoize((search, items) => filter(items, this.isMatch(search)), isDeepStrictEqual);

    render() {
        const filtered = this.filterReminders(this.state.search, [...this.props.entities.reminders.values()]);
        return (
            <Grid>
                <Grid.Column width={5} className='squarify'>
                    <ReminderForm
                        isOpen={this.state.isModalOpen}
                        channels={this.props.entities.channels}
                        toggleModal={this.toggleModal}
                        create={this.props.createReminder} />
                    <Input fluid
                        icon='search'
                        placeholder='Search...'
                        value={this.state.search}
                        onChange={debounce(this.onSearch, 500, { leading: true })}
                        style={{ marginTop: '1em' }} />
                </Grid.Column>
                <Grid.Column width={11} className='squarify'>
                    <Segment>
                        <Table striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Time</Table.HeaderCell>
                                    <Table.HeaderCell>Message</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    filtered.map(reminder =>
                                        <Table.Row key={reminder.key}>
                                            <Table.Cell collapsing>
                                                <Checkbox toggle checked />
                                            </Table.Cell>
                                            <Table.Cell content={reminder.channel.name} />
                                            <Table.Cell content={moment(reminder.time).format('hh:mm A')} />
                                            <Table.Cell content={reminder.message} />
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}
