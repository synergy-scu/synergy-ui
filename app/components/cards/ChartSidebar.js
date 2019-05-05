import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

import { ChartTypes, ExtendedChartOptions } from '../../api/constants/ChartTypes';

export const ChartSidebar = props => {
    const closeSidebar = () => props.toggleSidebar(false);

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
            {
                props.charts.map(chart => {
                    const icon = ExtendedChartOptions[chart.chartType].icon;
                    const onSelectChart = () => props.selectChart(chart);
                    return (
                        <Menu.Item key={chart.key} as='a' onClick={onSelectChart}>
                            {chart.name || 'Unnamed Chart'}
                            <Icon name={icon} color={props.selected.key === chart.key ? 'green' : null} />
                        </Menu.Item>
                    );
                })
            }
        </Sidebar>
    );
};

ChartSidebar.propTypes = {
    isMenuVisible: PropTypes.bool,
    selected: PropTypes.shape({
        key: PropTypes.string.isRequired,
    }),
    charts: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string,
        chartType: PropTypes.oneOf(Object.values(ChartTypes)).isRequired,
    })),
    toggleSidebar: PropTypes.func.isRequired,
    selectChart: PropTypes.func.isRequired,
};
