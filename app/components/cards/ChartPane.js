import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Menu, Icon, Segment, Popup } from 'semantic-ui-react';
import memoize from 'memoize-one';
import { isDeepStrictEqual } from 'util';

import { ChartTypes, UsageTypes, ExtendedUsageOptions } from '../../api/constants/ChartTypes';

import createChart from './charts/ChartContainer';
import { LineChart } from './charts/LineChart';
import { PieChart } from './charts/PieChart';
import { BarChart } from './charts/BarChart';
import { BurstChart } from './charts/BurstChart';
import { NoChart } from './charts/NoChart';
import { ChartSidebar } from './ChartSidebar';
import EditMenuContainer from '../editor/EditMenuContainer';

export class ChartPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedChart: '',
            selectedType: ChartTypes.NONE,
        };
    }

    static propTypes = {
        usageType: PropTypes.oneOf(Object.values(UsageTypes)).isRequired,
        entities: PropTypes.shape({
            charts: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
        activeTab: PropTypes.string.isRequired,
        changeTab: PropTypes.func.isRequired,
        isSidebarOpen: PropTypes.bool.isRequired,
        toggleSidebar: PropTypes.func.isRequired,
        fetchUsage: PropTypes.func.isRequired,
    };

    reset = () => {
        this.setState({
            selectedChart: '',
            selectedType: ChartTypes.NONE,
        });
    };

    selectChart = chart => {
        this.setState({
            selectedChart: chart.chartID,
            selectedType: chart.chartType,
        });
        if (this.props.usageType === UsageTypes.HISTORICAL) {
            this.props.fetchUsage(chart);
        }
        this.props.changeTab('view');
        this.props.toggleSidebar(false);
    };

    chartSwitcher = memoize(chart => {
        switch (chart.chartType) {
            case ChartTypes.LINE:
                return LineChart;
            case ChartTypes.PIE:
                return PieChart;
            case ChartTypes.BAR:
                return BarChart;
            case ChartTypes.BURST:
                return BurstChart;
            default:
                return NoChart;
        }
    }, isDeepStrictEqual);

    onTabChange = (event, { name }) => {
        if (this.props.activeTab !== name) {
            if (name === 'menu') {
                this.props.toggleSidebar(true);
            } else {
                this.props.changeTab(name);
            }
        }
    };

    render() {

        const chart = this.props.entities.charts.get(this.state.selectedChart) || {};
        const ChartContainer = createChart(this.chartSwitcher(chart));
        const Component = this.props.activeTab === 'view' ? ChartContainer : EditMenuContainer;
        const componentProps = this.props.activeTab === 'view'
            ? { chartID: this.state.selectedChart }
            : { menuType: 'create', groupType: 'chart', usageType: this.props.usageType };

        const chartPath = ` >> ${this.props.entities.charts.has(this.state.selectedChart) ? this.props.entities.charts.get(this.state.selectedChart).name || 'Unnamed Chart' : 'Unnamed Chart'}`;

        return (
            <Sidebar.Pushable>
                <ChartSidebar
                    isMenuVisible={this.props.isSidebarOpen}
                    charts={[...this.props.entities.charts.values()].filter(item => item.usageType === this.props.usageType)}
                    toggleSidebar={this.props.toggleSidebar}
                    selectChart={this.selectChart}
                    selected={this.state.selectedChart} />

                <Sidebar.Pusher id='charts' className='contrast'>
                    <Menu pointing secondary>
                        <Menu.Item link
                            name='menu'
                            onClick={this.onTabChange}>
                            <Icon name='bars' />
                        </Menu.Item>
                        <Menu.Item content={this.props.activeTab === 'view' ? `View ${ExtendedUsageOptions[this.props.usageType].verbiage.capitalized}${this.state.selectedChart.length ? chartPath : ''}` : `Create ${ExtendedUsageOptions[this.props.usageType].verbiage.capitalized} Chart`} />
                        <Menu.Menu position='right'>
                            <Menu.Item link
                                name='view'
                                active={this.props.activeTab === 'view'}
                                onClick={this.onTabChange}>
                                <Popup
                                    position='bottom right'
                                    trigger={<Icon name='eye' />}
                                    content='View Usage' />
                            </Menu.Item>
                            <Menu.Item link
                                name='add'
                                active={this.props.activeTab === 'add'}
                                onClick={this.onTabChange}>
                                <Popup
                                    position='bottom right'
                                    trigger={<Icon name='plus' />}
                                    content='Create Chart' />
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                    <Segment basic={this.props.activeTab === 'add'} style={this.props.activeTab === 'view' ? { display: 'flex', flex: 1, flexDirection: 'column', margin: '0 0 0.25em 0' } : { margin: '0 0 0.25em 0' }}>
                        <Component {...componentProps} />
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}
