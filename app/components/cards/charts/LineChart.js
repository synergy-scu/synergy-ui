import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Statistic } from 'semantic-ui-react';
import { ResponsiveLine } from '@nivo/line';
import memoize from 'memoize-one';
import moment from 'moment';
import { maxBy, last } from 'lodash';
import { timeFormat } from 'd3-time-format';

import { lineChart } from '../../../api/charts';
import { ChartTypes, UsageTypes } from '../../../api/constants/ChartTypes';
import { millisToHours, ampsTokWh, stripLongDecimal } from '../../../api/socket/usageUtils';

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
        const maxY = points.length ? maxBy(points, 'y').y * 5 : 0;

        const averages = {};
        stream.channels.forEach(channel => {
            averages[channel] = 0;
        });

        stream.results.forEach(result => {
            [...result.channels.entries()].forEach(([channel, amperage]) => {
                averages[channel] += amperage;
            });
        });

        Object.keys(averages).forEach(channel => {
            averages[channel] /= stream.results.length;
        });

        let kWhs = 0;
        if (points.length) {
            kWhs = Object.entries(averages).reduce((total, [channel, amperage]) => {
                const durationInMillis = stream.timers.get(channel).asMilliseconds();
                const durationInHours = millisToHours(durationInMillis);
                return total + ampsTokWh(amperage, durationInHours);
            }, 0);
        }

        const cost = stripLongDecimal(kWhs * this.props.user.cost);

        return (
            <Grid columns={2}>
                <Grid.Column width={2}>
                    <Button.Group vertical>
                        <Button content='Stream' onClick={this.props.fetchUsage} disabled={stream.connected} />
                        <Button content='Disconnect' onClick={this.props.disconnect} disabled={!stream.connected} />
                    </Button.Group>
                    <Statistic horizontal size='mini' label='kWh' value={stripLongDecimal(kWhs)} />
                    {
                        this.props.user.cost > 0 && <Statistic horizontal size='mini' label='USD' value={`$${cost}`} />
                    }
                </Grid.Column>
                <Grid.Column width={14}>
                    <ResponsiveLine
                        data={[{ id: this.props.chartID, data: points }]}
                        margin={{ top: 20, right: 20, bottom: 100, left: 60 }}
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
                </Grid.Column>
            </Grid>

        );
    }
}
