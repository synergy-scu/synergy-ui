import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { isDeepStrictEqual } from 'util';

import { Grid, Statistic, Button } from 'semantic-ui-react';
import { AutoSizer } from 'react-virtualized';

import { EditMenuModal } from '../../editor/EditMenuModal';
import { RealtimeLine, HistoricalLine } from './nivo/Line';

import { lineChart, stackedLineChart } from '../../../api/charts/line/generator';
import { getTimeFormat } from '../../../api/charts/line/lineProps';
import { historyChartProps, streamChartProps } from '../../../api/chartProps';
import { ChartTypes, UsageTypes } from '../../../api/constants/ChartTypes';
import { stripLongDecimal, calculateKWHs, calculateAverage, calculateCost } from '../../../api/socket/usageUtils';
import { getMaxY } from '../../../api/charts/line/lineProps';

const MAX_POINTS = 60;

export class LineChart extends React.Component {
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
                added: PropTypes.any,
            })).isRequired,
            all: PropTypes.bool.isRequired,
            created: PropTypes.any,
            updated: PropTypes.any,
        }).isRequired,
        // chartSet: PropTypes.shape(this.props.usageType === UsageTypes.REALTIME ? streamChartProps : historyChartProps).isRequired,
        refresh: PropTypes.func.isRequired,
        pauseStream: PropTypes.func.isRequired,
    };

    componentWillUnmount() {
        if (this.props.chart.usageType === UsageTypes.REALTIME && this.props.chartSet.connected) {
            // this.props.chartSet.socket.disconnect();
        }
    }

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

    getPoints = memoize((chartSet, stacked) =>
        !stacked
            ? lineChart(chartSet.chartID, chartSet.results, MAX_POINTS)
            : stackedLineChart(chartSet.groupedResults, MAX_POINTS, true)
    , isDeepStrictEqual);

    render() {
        const { chart, chartSet } = this.props;
        const isRealtime = this.props.usageType === UsageTypes.REALTIME;

        const lines = this.getPoints(chartSet, false);
        const maxY = getMaxY(lines, 1.5);

        const kWhs = calculateKWHs(calculateAverage(chartSet.channels, chartSet.results), chartSet.timers);
        const cost = calculateCost(kWhs, this.props.user.cost);

        const Line = isRealtime ? RealtimeLine : HistoricalLine;
        const format = getTimeFormat(chartSet.splitDurationPeriod, chart.usageType);

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
                            <Line
                                height={height}
                                width={width}
                                lines={lines}
                                maxY={maxY}
                                format={format} />
                        }
                    </AutoSizer>
                </Grid.Column>
            </Grid>

        );
    }
}
