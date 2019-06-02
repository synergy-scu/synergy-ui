import React from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, Button, Icon } from 'semantic-ui-react';
import moment from 'moment';

import { TimePicker } from './TimePicker';

export class ReminderForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            channel: '',
            message: '',
            time: {
                hour: (moment().hour() > 12 ? moment().hour(moment().hour() - 12).hour() : moment().hour()).toString(),
                minute: moment().minute().toString(),
                period: moment().hour() > 12 ? 'pm' : 'am',
            },
        };
    }

    static defaultProps = {
        isOpen: false,
    };

    static propTypes = {
        isOpen: PropTypes.bool,
        channels: PropTypes.instanceOf(Map).isRequired,
        toggleModal: PropTypes.func.isRequired,
        create: PropTypes.func.isRequired,
    };

    reset = () => {
        this.setState({
            channel: '',
            message: '',
            time: {
                hour: (moment().hour() > 12 ? moment().hour(moment().hour() - 12) : moment().hour()).toString(),
                minute: moment().minute().toString(),
                period: moment().hour() > 12 ? 'pm' : 'am',
            },
        });
    };

    create = () => {
        const hour = parseInt(this.state.time.hour, 10);
        const minute = parseInt(this.state.time.minute, 10);
        const time = moment().hour(hour).minute(minute).second(0).millisecond(0);

        if (this.state.time.period === 'pm') {
            time.add(12, 'h');
        }

        this.props.create({
            ...this.state,
            time,
        }).then(() => {
            this.reset();
            this.props.toggleModal();
        });
    }

    onChannelChange = (event, { value }) => {
        this.setState({
            channel: value,
        });
    };

    onMessageChange = (event, { value }) => {
        this.setState({
            message: value,
        });
    };

    onTimeChange = (event, { field, value }) => {
        if ((field === 'minute' || field === 'hour') && !value.length) {
            this.setState({
                time: {
                    ...this.state.time,
                    [field]: value,
                },
            });
        } else if (field === 'period') {
            this.setState({
                time: {
                    ...this.state.time,
                    period: value,
                },
            });
        } else if (field === 'minute') {
            const minute = parseInt(value, 10);
            if (minute >= 0 && minute <= 59 && value.length <= 2) {
                this.setState({
                    time: {
                        ...this.state.time,
                        [field]: minute === 0 ? value.concat('0') : value,
                    },
                });
            }
        } else if (field === 'hour') {
            const hour = parseInt(value, 10);
            if (hour >= 0 && hour <= 12 && value.length <= 2) {
                if (hour === 12) {
                    this.setState({
                        time: {
                            ...this.state.time,
                            period: 'pm',
                            [field]: value,
                        },
                    });
                } else if (hour === 0) {
                    this.setState({
                        time: {
                            ...this.state.time,
                            period: 'am',
                            [field]: value,
                        },
                    });
                } else {
                    this.setState({
                        time: {
                            ...this.state.time,
                            [field]: value,
                        },
                    });
                }
            }
        }
    }

    render() {
        const channels = [...this.props.channels.values()].map(channel => {
            return {
                key: channel.channelID,
                value: channel.channelID,
                text: channel.name || 'Unnamed Channel',
            };
        });

        const isDisabled = !this.props.channels.has(this.state.channel)
            || !this.state.message.length
            || !this.state.time.hour.length
            || !this.state.time.minute.length;

        return (
            <Modal centered
                open={this.props.isOpen}
                closeOnDimmerClick={false}
                closeOnEscape={false}
                closeIcon={<Icon link name='close' onClick={this.props.toggleModal} />}
                trigger={
                    <Button fluid
                        color='green'
                        content='Create New Reminder'
                        onClick={this.props.toggleModal} />
                }>
                <Modal.Header>New Reminder</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Dropdown selection search clearable
                            label='Channel'
                            options={channels}
                            value={this.state.channel}
                            onChange={this.onChannelChange} />
                        <Form.TextArea
                            label='Message'
                            rows={2}
                            value={this.state.message}
                            onChange={this.onMessageChange} />
                        <Form.Field>
                            <label>Time</label>
                            <TimePicker
                                time={this.state.time}
                                onTimeChange={this.onTimeChange} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color='green'
                        content='Create'
                        disabled={isDisabled}
                        onClick={this.create} />
                </Modal.Actions>
            </Modal>
        );
    }
}
