import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';

import { genDevices, genGroups } from '../../api/data';
import { GroupsPane } from './GroupsPane';

export class SettingsPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.panes = [
            {
                menuItem: 'Groups',
                render: () => <Tab.Pane attached={false}><GroupsPane /></Tab.Pane>,
            },
            {
                menuItem: 'Devices',
                render: () => <Tab.Pane attached={false}>You have not added any devices yet</Tab.Pane>,
            },
            {
                menuItem: 'Channels',
                render: () => <Tab.Pane attached={false}>You have not added any channels yet</Tab.Pane>,
            },
            {
                menuItem: 'Add',
                render: () => <Tab.Pane attached={false}>Add a group or device</Tab.Pane>,
            },
        ];
    }

    render() {
        // const { devices, allChannels } = genDevices(25);
        // const groups = genGroups(8, devices, allChannels);
        // console.log(allChannels, devices, groups);
        return (
            <div id='settings'>
                <Tab menu={{ secondary: true, pointing: true }} panes={this.panes} />
            </div>
        );
    }
}
