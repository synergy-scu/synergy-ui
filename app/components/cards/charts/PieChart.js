import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { isDeepStrictEqual } from 'util';

import { Grid, Statistic, Button } from 'semantic-ui-react';
import { AutoSizer } from 'react-virtualized';
import { Pie } from '@nivo/pie';

import { EditMenuModal } from '../../editor/EditMenuModal';
import { ChartTypes, UsageTypes } from '../../../api/constants/ChartTypes';
import { stripLongDecimal, calculateKWHs, calculateAverage, calculateCost } from '../../../api/socket/usageUtils';
import { pieProps, donutProps, noDataProps } from '../../../api/charts/pie/pieProps';
import { pieChartReal, pieChartHistory } from '../../../api/charts/pie/generator';


export class PieChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditModalOpen: false,
        };
    }

    static propTypes = {
        user: PropTypes.shape({
            cost: PropTypes.number,
        }),
        usageType: PropTypes.oneOf(Object.values(UsageTypes)).isRequired,
        entities: PropTypes.shape({
            names: PropTypes.instanceOf(Map).isRequired,
        }).isRequired,
        chart: PropTypes.shape({
            key: PropTypes.string.isRequired,
            uuid: PropTypes.string.isRequired,
            chartID: PropTypes.string.isRequired,
            name: PropTypes.string,
            chartType: PropTypes.oneOf(Object.values(ChartTypes)).isRequired,
            usageType: PropTypes.oneOf(Object.values(UsageTypes)).isRequired,
            options: PropTypes.object,
            count: PropTypes.number.isRequired,
            members: PropTypes.arrayOf(PropTypes.shape({
                chartID: PropTypes.string.isRequired,
                uuid: PropTypes.string.isRequired,
                type: PropTypes.oneOf(['channel', 'device', 'group']).isRequired,
                added: PropTypes.instanceOf(Date).isRequired,
            })).isRequired,
            all: PropTypes.bool.isRequired,
            created: PropTypes.instanceOf(Date).isRequired,
            updated: PropTypes.instanceOf(Date).isRequired,
        }).isRequired,
        // chartSet: PropTypes.shape(this.props.usageType === UsageTypes.REALTIME ? streamChartProps : historyChartProps).isRequired,
        refresh: PropTypes.func.isRequired,
        pauseStream: PropTypes.func.isRequired,
    };

    toggleModal = () => {
        this.setState({
            isEditModalOpen: !this.state.isEditModalOpen,
        });
    };

    pauseStream = () => {
        if (this.props.usageType === UsageTypes.REALTIME) {
            this.props.pauseStream(this.props.chart.chartID, !this.props.chartSet.paused);
        }
    };

    getPoints = memoize((results, isRealtime, isGrouped) =>
        isRealtime
            ? pieChartReal(results, this.props.entities.names, isGrouped)
            : pieChartHistory(results, this.props.entities.names, isGrouped)
    , isDeepStrictEqual);

    render() {
        const { chart, chartSet } = this.props;
        const isRealtime = this.props.usageType === UsageTypes.REALTIME;

        const slices = chartSet.results.length
            ? this.getPoints(chartSet.results, isRealtime, false)
            : [{ id: 'empty', label: 'empty', value: 100 }];

        const isEmpty = Array.isArray(slices) && Boolean(slices.length === 1) && slices[0].id === 'empty';

        const kWhs = calculateKWHs(calculateAverage(chartSet.channels, chartSet.results), chartSet.timers);
        const cost = calculateCost(kWhs, this.props.user.cost);

        let isStreaming = false;
        if (isRealtime) {
            isStreaming = chartSet.connected && !chartSet.paused;
        }

        return (
            <Grid columns={2} style={{ height: '110%', padding: '1em' }}>
                <Grid.Column width={3} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {
                        this.props.usageType === UsageTypes.REALTIME
                            ? <Button icon={isStreaming ? 'pause' : 'play'} onClick={this.pauseStream} />
                            : <Button fluid icon='sync' onClick={this.props.refresh} />
                    }
                    {
                        // this.props.usageType === UsageTypes.HISTORICAL && <Button fluid icon='sync' onClick={this.props.refresh} />
                    }
                    <Statistic size='mini' label='kWh' value={stripLongDecimal(kWhs)} />
                    {
                        this.props.user.cost && this.props.user.cost > 0 &&
                        <Statistic size='mini' label='USD' value={stripLongDecimal(cost)} style={{ margin: 0 }} />
                    }
                    {
                        false && <EditMenuModal isChart
                            isOpen={this.state.isEditModalOpen}
                            uuid={this.props.chart.uuid}
                            menuType='update'
                            groupType='chart'
                            toggleModal={this.toggleModal} />
                    }
                </Grid.Column>
                <Grid.Column width={13}>
                    <AutoSizer>
                        {({ height, width }) =>
                            <Pie
                                {...pieProps}
                                {...chart.options.donut ? donutProps : {}}
                                {...isEmpty ? noDataProps : {}}
                                height={height}
                                width={width}
                                data={slices} />
                        }
                    </AutoSizer>
                </Grid.Column>
            </Grid>
        );
    }
}
