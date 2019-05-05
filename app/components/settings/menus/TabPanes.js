import { GroupsMenu } from './GroupsMenu';
import { DevicesMenu } from './DevicesMenu';
import { ChannelsMenu } from './ChannelsMenu';
import { ReminderMenu } from './ReminderMenu';

export default {
    group: {
        menuItem: 'Groups',
        component: GroupsMenu,
        name: 'group',
    },
    device: {
        menuItem: 'Devices',
        component: DevicesMenu,
        name: 'device',
    },
    channel: {
        menuItem: 'Channels',
        component: ChannelsMenu,
        name: 'channel',
    },
    reminder: {
        menuItem: 'Reminders',
        component: ReminderMenu,
        name: 'reminder',
    },
};
