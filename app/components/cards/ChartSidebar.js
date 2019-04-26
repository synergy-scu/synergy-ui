import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';

import { ChartTypes } from '../../api/constants/ChartTypes';

export const ChartSidebar = props =>
    <Sidebar vertical
        as={Menu}
        animation='overlay'
        direction='left'
        visible={props.isMenuVisible}
        onHide={props.toggleSidebar}>
        <Menu.Item header style={{ display: 'flex', justifyContent: 'space-between', alignitems: 'center' }}>
            <span>Charts</span>
            <Icon link name='bars' onClick={props.toggleSidebar} />
        </Menu.Item>
        {
            props.charts.map(chart => {
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

                const onSelectChart = () => props.selectChart(chart);
                return (
                    <Menu.Item key={chart.key} as='a' onClick={onSelectChart}>
                        {chart.name || 'Unnamed Chart'}
                        <Icon name={icon} color={props.selected === chart.key ? 'green' : null}/>
                    </Menu.Item>
                );
            })
        }
    </Sidebar>;

ChartSidebar.propTypes = {
    isMenuVisible: PropTypes.bool,
    selected: PropTypes.string.isRequired,
    charts: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string,
        chartType: PropTypes.oneOf(Object.values(ChartTypes)).isRequired,
    })),
    toggleSidebar: PropTypes.func.isRequired,
    selectChart: PropTypes.func.isRequired,
};
