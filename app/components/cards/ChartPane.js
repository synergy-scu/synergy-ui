import React from 'react';
import PropTypes from 'prop-types';
import { Button, Sidebar, Menu, Icon } from 'semantic-ui-react';
import memoize from 'memoize-one';
import { isEqual } from 'lodash';

import { ChartTypes } from '../../api/constants/ChartTypes';

import createChart from './charts/ChartContainer';
import { LineChart } from './charts/LineChart';
import { PieChart } from './charts/PieChart';
import { BarChart } from './charts/BarChart';
import { BurstChart } from './charts/BurstChart';
import { NoChart } from './charts/NoChart';

export class ChartPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMenuVisible: true,
            selectedChart: '',
            selectedType: ChartTypes.NONE,
        };
    }

    static propTypes = {
        entities: PropTypes.shape({
            charts: PropTypes.instanceOf(Map).isRequired,
        }),
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

    chartSwitcher = memoize((type, chartID) => {
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

    render() {

        const Chart = createChart(this.chartSwitcher(this.state.selectedType, this.state.selectedChart));

        return (
            <Sidebar.Pushable>
                <Sidebar vertical
                    as={Menu}
                    animation='overlay'
                    direction='left'
                    visible={this.state.isMenuVisible}>
                    <Menu.Item header style={{ display: 'flex', justifyContent: 'space-between', alignitems: 'center' }}>
                        <span>Charts</span>
                        <Icon link name='close' onClick={this.toggleSidebar} />
                    </Menu.Item>
                    {
                        [...this.props.entities.charts.values()].map(chart => {
                            let icon;
                            if (chart.chartType === ChartTypes.LINE) {
                                icon = 'chart line';
                            } else if (chart.chartType === ChartTypes.BAR) {
                                icon = 'chart bar';
                            } else if (chart.chartType === ChartTypes.PIE) {
                                icon = 'chart pie';
                            } else if (chart.chartType === ChartTypes.BURST) {
                                icon = 'sun';
                            } else {
                                icon = 'ban';
                            }

                            const selectChart = () => this.selectChart(chart);
                            return (
                                <Menu.Item key={chart.key} active={this.state.selected === chart.key} as='a' onClick={selectChart}>
                                    {chart.name || 'Unnamed Chart'}
                                    <Icon name={icon} />
                                </Menu.Item>
                            );
                        })
                    }
                </Sidebar>

                <Sidebar.Pusher>
                    <Button icon='angle right' onClick={this.toggleSidebar} />
                    <Chart chartID={this.state.selectedChart} />
                </Sidebar.Pusher>
            </Sidebar.Pushable>

        );
    }
}
