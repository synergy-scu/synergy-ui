import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Container, Label, Table } from 'semantic-ui-react';

export const DeviceListing = props =>
    <Segment.Group>
        <Segment>
            {props.name}
        </Segment>
        <Segment>
            <Table basic='very'>
                <Table.Body>
                    {
                        [...props.channels.values()].map(channel =>
                            <Table.Row key={channel.channelID}>
                                <Table.Cell width={6}>
                                    {channel.name || 'Unnamed Channel'}
                                </Table.Cell>
                                <Table.Cell singleLine width={6}>
                                    {channel.channelID}
                                </Table.Cell>
                                <Table.Cell width={4}>
                                    {channel.current}
                                </Table.Cell>
                            </Table.Row>
                        )
                    }
                </Table.Body>
            </Table>
        </Segment>
    </Segment.Group>;

