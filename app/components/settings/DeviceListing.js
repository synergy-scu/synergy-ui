import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Icon, Popup, Divider } from 'semantic-ui-react';

export const DeviceListing = props =>
    <Segment.Group className='device'>
        <Segment className='title' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className='name'>{props.name} <Icon link name='edit' onClick={props.editDevice} /></span>
            <Popup hoverable
                size='small'
                trigger={<Icon circular size='small' name='question' />}
                content={
                    <div>
                        <Icon name='power' /> Is Powered<br />
                        <Icon name='tachometer alternate' /> View Usage<br />
                        <Icon name='bell' /> Edit Notifications<br />
                        <Icon name='edit' /> Edit Device/Channel<br />
                    </div>
                } />
        </Segment>
        <Segment className='channels'>
            <Segment.Group>
                {
                    [...props.channels.values()].map((channel, idx) =>
                        <React.Fragment key={channel.channelID}>
                            <Segment basic className='row'>
                                <span>
                                    <Icon name='power' color={channel.current > 0 ? 'green' : 'red'} />
                                    {channel.name || 'Unnamed Channel'}
                                </span>
                                <span>
                                    <Icon link name='tachometer alternate' onClick={props.viewUsage} />
                                    <Icon link name='bell' onClick={props.editNotifications} />
                                    <Icon link name='edit' onClick={props.editChannel} />
                                </span>
                            </Segment>
                            {
                                idx !== props.channels.size - 1 &&
                                    <Divider />
                            }
                        </React.Fragment>

                    )
                }
            </Segment.Group>
        </Segment>
    </Segment.Group>;

DeviceListing.propTypes = {
    name: PropTypes.string.isRequired,
    channels: PropTypes.instanceOf(Map).isRequired,
    viewUsage: PropTypes.func,
    editNotifications: PropTypes.func,
    editDevice: PropTypes.func,
    editChannel: PropTypes.func,
};
