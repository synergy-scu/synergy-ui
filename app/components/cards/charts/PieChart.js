import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react';
import { ResponsivePie } from '@nivo/pie';
import memoize from 'memoize-one';
import moment from 'moment';

import { pieChart } from '../../../api/charts';
import { ChartTypes, UsageTypes } from '../../../api/constants/ChartTypes';

export class PieChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            streamID: null,
        };
    }

    static propTypes = {
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
        entities: PropTypes.shape({
            channels: PropTypes.instanceOf(Map).isRequired,
        }),
        disconnect: PropTypes.func.isRequired,
        fetchUsage: PropTypes.func.isRequired,
    };

    getPoints = memoize((points, channelMap, pieType) => pieChart(points, channelMap, pieType));

    render() {
        const { chart, stream } = this.props;

        const points = this.getPoints(stream.results, this.props.entities.channels, chart.chartType);

        return (
            <Grid columns={2}>
                <Grid.Column width={2}>
                    <Button.Group vertical>
                        <Button content='Stream' onClick={this.props.fetchUsage} disabled={stream.connected} />
                        <Button content='Disconnect' onClick={this.props.disconnect} disabled={!stream.connected} />
                    </Button.Group>
                </Grid.Column>
                <Grid.Column width={14}>
                    <ResponsivePie
                        data={points}
                        margin={{ top: 20, right: 20, bottom: 100, left: 60 }}
                        innerRadius={0.2}
                        padAngle={0.7}
                        cornerRadius={3}
                        slicesLabelsSkipAngle={10}
                        radialLabel={segment => segment.label} />
                    {/* legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                itemTextColor: '#999',
                                symbolShape: 'circle',
                                // legendFormat: segment => segment.label,
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemTextColor: '#000',
                                        },
                                    },
                                ],
                            },
                        ]} /> */}
                </Grid.Column>
            </Grid>

        );
    }
}
