import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';

import SettingsTabContainer from './SettingsTabContainer';
import TabPanes from './menus/TabPanes';

export class SettingsPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        activeTab: PropTypes.number.isRequired,
        changeTab: PropTypes.func.isRequired,
    }

    onTabChange = (event, { activeIndex }) => {
        this.props.changeTab(activeIndex);
    };

    render() {
        return (
            <Tab
                id="settings"
                menu={{ secondary: true, pointing: true }}
                panes={TabPanes.map(pane => {
                    const ConnectedPane = SettingsTabContainer(pane.component);
                    return {
                        menuItem: pane.menuItem,
                        render: () =>
                            <Tab.Pane attached={false}>
                                <ConnectedPane />
                            </Tab.Pane>,
                    };
                })}
                activeIndex={this.props.activeTab}
                onTabChange={this.onTabChange}
            />
        );
    }
}
