import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Statistic } from 'semantic-ui-react';
import { ResponsiveLine, Line } from '@nivo/line';
import { AutoSizer } from 'react-virtualized';
import memoize from 'memoize-one';
import moment from 'moment';
import { maxBy, last } from 'lodash';
import { timeFormat } from 'd3-time-format';

import { lineChart } from '../../../api/charts';
import { ChartTypes, UsageTypes } from '../../../api/constants/ChartTypes';
import { millisToHours, ampsTokWh, stripLongDecimal, calculateKWHs, calculateAverage, calculateCost } from '../../../api/socket/usageUtils';

export class LineChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.formatTime = timeFormat('%I:%M% %p');
    }

    static propTypes = {
        user: PropTypes.shape({
            cost: PropTypes.number,
        }),
        chartID: PropTypes.string.isRequired,
        chart: PropTypes.shape({
            key: PropTypes.string.isRequired,
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
        stream: PropTypes.shape({
            chartID: PropTypes.string.isRequired,
            streamID: PropTypes.string.isRequired,
            channels: PropTypes.arrayOf(PropTypes.string).isRequired,
            socket: PropTypes.object,
            connected: PropTypes.bool.isRequired,
            results: PropTypes.arrayOf(PropTypes.shape({
                time: PropTypes.instanceOf(moment),
                channels: PropTypes.instanceOf(Map),
            })).isRequired,
        }),
        disconnect: PropTypes.func.isRequired,
        fetchUsage: PropTypes.func.isRequired,
    }

    getPoints = memoize((points, stacked) => lineChart(points, 60, stacked));

    render() {
        const { chart, stream } = this.props;
        const points = this.getPoints(stream.results, false);
        const maxY = points.length ? maxBy(points, 'y').y * 3 : 0;

        const kWhs = calculateKWHs(calculateAverage(stream.channels, stream.results), stream.timers);
        const cost = calculateCost(kWhs, this.props.user.cost);

        return (
            <Grid columns={2} style={{ height: '110%', padding: '1em' }}>
                <Grid.Column width={2} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Button.Group vertical>
                        <Button icon='play' onClick={this.props.fetchUsage} disabled={stream.connected} />
                        <Button icon='stop' onClick={this.props.disconnect} disabled={!stream.connected} />
                    </Button.Group>
                    <Statistic size='mini' label='kWh' value={stripLongDecimal(kWhs)} />
                    {
                        this.props.user.cost && this.props.user.cost > 0 &&
                            <Statistic size='mini' label='USD' value={stripLongDecimal(cost)} style={{ margin: 0 }} />
                    }
                </Grid.Column>
                <Grid.Column width={14}>
                    <AutoSizer>
                        {({ height, width }) =>
                            <Line
                                height={height}
                                width={width}
                                data={[{ id: this.props.chartID, data: points }]}
                                margin={{ top: 0, right: 0, bottom: 30, left: 60 }}
                                xScale={{ type: 'time', format: '%Q' }}
                                yScale={{ type: 'linear', min: 0, max: maxY }}
                                enableGridX={false}
                                enableDots={false}
                                curve='monotoneX'
                                animate={false}
                                isInteractive={false}
                                lineWidth={5}
                                axisBottom={{
                                    format: '%I:%M% %p',
                                    legend: `${this.formatTime(moment().valueOf())}`,
                                    legendOffset: 20,
                                    legendPosition: 'end',
                                    tickValues: 0,
                                }}
                                axisLeft={{
                                    legend: 'Amps',
                                    legendOffset: -40,
                                    legendPosition: 'middle',
                                }}
                                theme={{
                                    grid: { line: { stroke: '#ddd', strokeDasharray: '1 2' } },
                                }} />
                        }
                    </AutoSizer>
                </Grid.Column>
            </Grid>

        );
    }
}
