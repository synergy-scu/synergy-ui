import React from 'react';

import { GroupsMenu } from './GroupsMenu';
import { DevicesMenu } from './DevicesMenu';
import { ChannelsMenu } from './ChannelsMenu';
import { AddMenu } from './AddMenu';

import GlobalSearchContainer from '../GlobalSearch';

export default [
    {
        menuItem: { key: 'add', icon: 'plus' },
        component: AddMenu,
        entity: 'add',
    },
    {
        menuItem: 'Groups',
        component: GroupsMenu,
        entity: 'group',
    },
    {
        menuItem: 'Devices',
        component: DevicesMenu,
        entity: 'device',
    },
    {
        menuItem: 'Channels',
        component: ChannelsMenu,
        entity: 'channel',
    },
    {
        menuItem:
            <React.Fragment key="search">
                <GlobalSearchContainer />
            </React.Fragment>,
        // eslint-disable-next-line react/display-name
        component: () => <span />,
        entity: 'search',
    },
];
