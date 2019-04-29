import { GroupsMenu } from './GroupsMenu';
import { DevicesMenu } from './DevicesMenu';
import { ChannelsMenu } from './ChannelsMenu';

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
};
