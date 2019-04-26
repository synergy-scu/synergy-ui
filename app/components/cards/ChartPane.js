import React from 'react';
import PropTypes from 'prop-types';
import { Button, Sidebar, Menu, Icon, Tab } from 'semantic-ui-react';
import memoize from 'memoize-one';
import { isEqual } from 'lodash';

import { ChartTypes } from '../../api/constants/ChartTypes';

import createChart from './charts/ChartContainer';
import { LineChart } from './charts/LineChart';
import { PieChart } from './charts/PieChart';
import { BarChart } from './charts/BarChart';
import { BurstChart } from './charts/BurstChart';
import { NoChart } from './charts/NoChart';
import TabPanes from './TabPanes';
import { ChartSidebar } from './ChartSidebar';

export class ChartPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMenuVisible: false,
            selectedChart: '',
            selectedType: ChartTypes.NONE,
        };
    }

    static propTypes = {
        entities: PropTypes.shape({
            charts: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
        chartsTab: PropTypes.number.isRequired,
        changeTab: PropTypes.func.isRequired,
    };

    toggleSidebar = () => {
        this.setState({
            isMenuVisible: !this.state.isMenuVisible,
        });
    };

    selectChart = ({ chartID, chartType }) => {
        this.setState({
            isMenuVisible: false,
            selectedChart: chartID,
            selectedType: chartType,
        });
    };

    chartSwitcher = memoize(type => {
        switch (type) {
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

    onTabChange = (event, { activeIndex }) => {
        if (activeIndex === 0) {
            this.toggleSidebar();
        } else {
            this.props.changeTab(activeIndex);
        }
    };

    render() {

        const Chart = createChart(this.chartSwitcher(this.state.selectedType, this.state.selectedChart));

        return (
            <Sidebar.Pushable>
                <ChartSidebar
                    isMenuVisible={this.state.isMenuVisible}
                    charts={[...this.props.entities.charts.values()]}
                    toggleSidebar={this.toggleSidebar}
                    selectChart={this.selectChart}
                    selected={this.state.selectedChart} />

                <Sidebar.Pusher id='charts'>
                    <Tab
                        menu={{ secondary: true, pointing: true }}
                        panes={
                            TabPanes(Chart).map(pane => {
                                const Component = pane.component;
                                return {
                                    key: pane.tab,
                                    menuItem: pane.menuItem,
                                    render: () =>
                                        <Tab.Pane attached={false}>
                                            <Component chartID={this.state.selectedChart} groupType='chart' />
                                        </Tab.Pane>,
                                };
                            })
                        }
                        activeIndex={this.props.chartsTab}
                        onTabChange={this.onTabChange} />
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}
