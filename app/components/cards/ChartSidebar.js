import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

import { ChartTypes, ExtendedChartOptions, UsageTypes } from '../../api/constants/ChartTypes';

export const ChartSidebar = props => {
    const closeSidebar = () => props.toggleSidebar(false);
    const onSelectCumulative = () => props.selectChart(props.cumulativeChart.uuid, true);

    return (
        <Sidebar vertical
            as={Menu}
            animation='overlay'
            direction='left'
            visible={props.isMenuVisible}
            onHide={closeSidebar}>
            <Menu.Item header style={{ display: 'flex', justifyContent: 'space-between', alignitems: 'center' }}>
                <span>Charts</span>
                <Icon link name='bars' onClick={closeSidebar} />
            </Menu.Item>
            <Menu.Item
                as='a'
                key={props.cumulativeChart.uuid}
                onClick={onSelectCumulative}
                style={props.selected === props.cumulativeChart.uuid ? { backgroundColor: '#F4FAD1' } : {}}>
                Cumulative Usage
                <Icon name={ExtendedChartOptions[props.usageType === UsageTypes.REALTIME ? ChartTypes.PIE : ChartTypes.LINE].icon} />
            </Menu.Item>
            {
                props.charts.map(chart => {
                    const icon = ExtendedChartOptions[chart.chartType].icon;
                    const onSelectChart = () => props.selectChart(chart.uuid);
                    return (
                        <Menu.Item
                            as='a'
                            key={chart.key}
                            onClick={onSelectChart}
                            style={props.selected === chart.key ? { backgroundColor: '#F4FAD1' } : {}}>
                            {chart.name || 'Unnamed Chart'}
                            <Icon name={icon} />
                        </Menu.Item>
                    );
                })
            }
        </Sidebar>
    );
};

ChartSidebar.propTypes = {
    isMenuVisible: PropTypes.bool,
    selected: PropTypes.string.isRequired,
    cumulativeChart: PropTypes.string.isRequired,
    usageType: PropTypes.oneOf(Object.values(UsageTypes)).isRequired,
    charts: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string,
        chartType: PropTypes.oneOf(Object.values(ChartTypes)).isRequired,
    })),
    toggleSidebar: PropTypes.func.isRequired,
    selectChart: PropTypes.func.isRequired,
};
