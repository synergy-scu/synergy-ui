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
    }

    static propTypes = {
        usageType: PropTypes.oneOf(Object.values(UsageTypes)).isRequired,
        activeTab: PropTypes.string.isRequired,
        isSidebarOpen: PropTypes.bool.isRequired,
        selectedChart: PropTypes.string.isRequired,
        chart: PropTypes.shape({
            key: PropTypes.string.isRequired,
            uuid: PropTypes.string.isRequired,
            chartID: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            chartType: PropTypes.oneOf(Object.values(ChartTypes)).isRequired,
            all: PropTypes.bool.isRequired,
        }).isRequired,

        entities: PropTypes.shape({
            charts: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
        cumulativeChart: PropTypes.string.isRequired,

        changeChart: PropTypes.func.isRequired,
        changeTab: PropTypes.func.isRequired,
        toggleSidebar: PropTypes.func.isRequired,

        streams: PropTypes.instanceOf(Map).isRequired,
        histories: PropTypes.instanceOf(Map).isRequired,

        requestChart: PropTypes.func.isRequired,
    };

    componentDidMount() {
        if (this.props.usageType === UsageTypes.HISTORICAL && this.props.isCumulative && this.props.entities.channels.size > 0) {
            this.props.requestChart(this.props.cumulativeChart.uuid, true);
        }
    }

    selectChart = (chartID, isCumulative = false) => {
        this.props.changeChart(chartID, isCumulative);
        if (this.props.usageType === UsageTypes.REALTIME ) {
            if (!this.props.streams.has(chartID)) {
                this.props.requestChart(chartID, isCumulative);
            } else if (this.props.streams.get(chartID).paused) {
                this.props.pauseStream(chartID, );
            }
        } else if (this.props.usageType === UsageTypes.HISTORICAL) {
            if (!this.props.histories.has(chartID)) {
                this.props.requestChart(chartID, isCumulative);
            }
        }
    };

    refresh = () => {
        if (this.props.usageType === UsageTypes.HISTORICAL) {
            this.props.requestChart(this.props.chart.uuid, this.props.chart.all);
        }
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

    filterCharts = memoize((charts, usageType) => [...charts.values()].filter(chart => chart.usageType === usageType));

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

        const { chart } = this.props;
        const hasChartInContainer = Boolean(chart.uuid.length);

        const ChartContainer = createChart(this.chartSwitcher(chart));
        const Component = this.props.activeTab === 'view' ? ChartContainer : EditMenuContainer;
        const componentProps = this.props.activeTab === 'view'
            ? { chart, usageType: this.props.usageType, refresh: this.refresh }
            : { menuType: 'create', groupType: 'chart', usageType: this.props.usageType };

        const chartPath = ` >> ${hasChartInContainer ? chart.name || 'Unnamed Chart' : 'Unnamed Chart'}`;

        return (
            <Sidebar.Pushable>
                <ChartSidebar
                    isMenuVisible={this.props.isSidebarOpen}
                    usageType={this.props.usageType}
                    charts={this.filterCharts(this.props.entities.charts, this.props.usageType)}
                    toggleSidebar={this.props.toggleSidebar}
                    selectChart={this.selectChart}
                    selected={this.props.selectedChart}
                    cumulativeChart={this.props.cumulativeChart} />

                <Sidebar.Pusher id='charts' className='contrast'>
                    <Menu pointing secondary>
                        <Menu.Item link
                            name='menu'
                            onClick={this.onTabChange}>
                            <Icon name='bars' />
                        </Menu.Item>
                        <Menu.Item content={this.props.activeTab === 'view' ? `View ${ExtendedUsageOptions[this.props.usageType].verbiage.capitalized}${hasChartInContainer ? chartPath : ''}` : `Create ${ExtendedUsageOptions[this.props.usageType].verbiage.capitalized} Chart`} />
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
