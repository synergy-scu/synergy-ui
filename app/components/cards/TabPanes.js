import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';

import AddMenuContainer from './AddMenuContainer';

export default Chart => [
    {
        menuItem: { key: 'menu', icon: 'bars' },
        component: Chart,
        tab: 'menu',
    },
    {
        menuItem: 'Usage Chart',
        component: Chart,
        tab: 'chart',
    },
    {
        menuItem:
            <Menu.Item key='add' className='menu right'>
                <Icon link name='plus' />
            </Menu.Item>,
        component: AddMenuContainer,
        tab: 'add',
    },
];
