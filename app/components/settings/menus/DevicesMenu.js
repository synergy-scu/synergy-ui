import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Button, Icon } from 'semantic-ui-react';

import { EntityMenu } from '../sections/EntityMenu';
import { EntityListing } from '../sections/EntityListing';

export class DevicesMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmDelete: false,
            isDeleting: false,
        };
    }

    static propTypes = {
        entities: PropTypes.shape({
            groups: PropTypes.instanceOf(Map).isRequired,
            devices: PropTypes.instanceOf(Map).isRequired,
            channels: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
        activeDevice: PropTypes.string.isRequired,
        changeActiveDevice: PropTypes.func.isRequired,
    };

    getChannels = group => {
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

    deleteDevice = () => {
        if (!this.state.confirmDelete) {
            this.setState({
                confirmDelete: true,
            });
        } else {
            // this.props.deleteDevice();
            console.log('DELETE DEVICE');
            this.setState({
                confirmDelete: false,
                isDeleting: true,
            });
        }
    };

    changeActiveDevice = itemID => {
        this.props.changeActiveDevice(itemID);
        this.setState({
            confirmDelete: false,
            isDeleting: false,
        });
    };

    render() {
        const { devices } = this.props.entities;
        let activeDevice = null;

        if (devices.size > 0) {
            activeDevice = devices.get(this.props.activeDevice);
        }

        return (
            <Grid>
                <Grid.Column width={5} className="squarify">
                    <EntityMenu
                        entityType="device"
                        activeItem={this.props.activeDevice}
                        items={devices}
                        setActiveItem={this.changeActiveDevice} />
                </Grid.Column>

                <Grid.Column width={11} className="squarify">
                    {
                        activeDevice &&
                            <Segment.Group>
                                <Segment className='split'>
                                    <span>{activeDevice.name || 'Unnamed Device'}</span>
                                    <Button icon compact
                                        loading={this.state.isDeleting}
                                        labelPosition={this.state.confirmDelete ? 'right' : null}
                                        color={this.state.confirmDelete ? 'red' : null}
                                        onClick={this.deleteDevice}>
                                        {
                                            this.state.confirmDelete && 'Confirm'
                                        }
                                        <Icon name={this.state.confirmDelete ? 'warning circle' : 'trash alternate outline'} />
                                    </Button>
                                </Segment>
                                <Segment>
                                    {
                                        activeDevice &&
                                            <EntityListing
                                                entityType="channel"
                                                items={[...activeDevice.channels.values()].map(channel => {
                                                    return {
                                                        ...this.props.entities.channels.get(channel),
                                                        uuid: channel,
                                                    };
                                                })} />
                                    }
                                </Segment>
                            </Segment.Group>
                    }
                </Grid.Column>
            </Grid>
        );
    }
}
