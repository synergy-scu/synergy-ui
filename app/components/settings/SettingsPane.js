import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Menu } from 'semantic-ui-react';

import SettingsTabContainer from './SettingsTabContainer';
import TabPanes from './menus/TabPanes';
import GlobalSearchContainer from './GlobalSearch';

export class SettingsPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    static propTypes = {
        activeTab: PropTypes.string.isRequired,
        changeTab: PropTypes.func.isRequired,
    };

    onTabChange = (event, { name }) => {
        if (this.props.activeTab !== name) {
            this.props.changeTab(name);
        }
    };

    render() {
        const activeMenu = TabPanes[this.props.activeTab];
        const ConnectedComponent = SettingsTabContainer(activeMenu.component);

        return (
            <div id='settings' className='contrast'>
                <Menu pointing secondary>
                    {
                        Object.values(TabPanes).map(tab =>
                            <Menu.Item link
                                key={tab.name}
                                name={tab.name}
                                active={this.props.activeTab === tab.name}
                                onClick={this.onTabChange}
                                content={tab.menuItem}>
                            </Menu.Item>
                        )
                    }
                    <Menu.Menu position='right'>
                        <Menu.Item className='search'>
                            <GlobalSearchContainer />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Segment basic={this.props.activeTab !== 'channel'}>
                    <ConnectedComponent />
                </Segment>
            </div>
        );
    }
}
