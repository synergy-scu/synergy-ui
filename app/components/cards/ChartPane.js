import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Menu, Icon, Segment, Popup } from 'semantic-ui-react';
import memoize from 'memoize-one';
import { isEqual } from 'lodash';

import { ChartTypes, UsageTypes } from '../../api/constants/ChartTypes';

import createChart from './charts/ChartContainer';
import { LineChart } from './charts/LineChart';
import { PieChart } from './charts/PieChart';
import { BarChart } from './charts/BarChart';
import { BurstChart } from './charts/BurstChart';
import { NoChart } from './charts/NoChart';
import { ChartSidebar } from './ChartSidebar';
import AddMenuContainer from './AddMenuContainer';

export class ChartPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedChart: '',
            selectedType: ChartTypes.NONE,
        };
    }

    static propTypes = {
        entities: PropTypes.shape({
            charts: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
        activeTab: PropTypes.string.isRequired,
        changeTab: PropTypes.func.isRequired,
        isSidebarOpen: PropTypes.bool.isRequired,
        toggleSidebar: PropTypes.func.isRequired,
    };

    reset = () => {
        this.setState({
            selectedChart: '',
            selectedType: ChartTypes.NONE,
        });
    };

    selectChart = ({ chartID, chartType }) => {
        this.setState({
            selectedChart: chartID,
            selectedType: chartType,
        });
        this.props.changeTab(0);
        this.props.toggleSidebar(false);
    };

    chartSwitcher = memoize(chart => {
        switch (chart.type) {
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
    }, isEqual);

    onTabChange = (event, { name }) => {
        if (name === 'menu') {
            this.props.toggleSidebar(true);
        } else {
            this.props.changeTab(name);
        }
    };

    render() {

        const Chart = createChart(this.chartSwitcher(this.state.selectedType, this.state.selectedChart));
        const Component = this.props.activeTab === 'view' ? Chart : AddMenuContainer;
        const componentProps = this.props.activeTab === 'view'
            ? { chartID: this.state.selectedChart }
            : { groupType: 'chart', usageType: UsageTypes.REALTIME };

        const chartPath = ` >> ${this.props.entities.charts.has(this.state.selectedChart) ? this.props.entities.charts.get(this.state.selectedChart).name || 'Unnamed Chart' : 'Unnamed Chart'}`;

        return (
            <Sidebar.Pushable>
                <ChartSidebar
                    isMenuVisible={this.props.isSidebarOpen}
                    charts={[...this.props.entities.charts.values()]}
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
                        <Menu.Item content={this.props.activeTab === 'view' ? `Real-time Usage${this.state.selectedChart.length ? chartPath : ''}` : 'Create Chart'} />
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
