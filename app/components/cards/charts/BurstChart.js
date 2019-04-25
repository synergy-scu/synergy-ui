import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react';
import { ResponsiveLine } from '@nivo/line';
import memoize from 'memoize-one';
import moment from 'moment';
import { timeFormat } from 'd3-time-format';

import { lineChart } from '../../../api/charts';
import { ChartTypes, UsageTypes } from '../../../api/constants/ChartTypes';

export class BurstChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            streamID: null,
        };

        this.formatTime = timeFormat('%I:%M% %p');
    }

    static propTypes = {
        chartID: PropTypes.string.isRequired,
        chart: PropTypes.shape({
            key: PropTypes.string.isRequired,
            chartID: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            chartType: PropTypes.oneOf(Object.values(ChartTypes)).isRequired,
            usageType: PropTypes.oneOf(Object.values(UsageTypes)).isRequired,
            options: PropTypes.object.isRequired,
            count: PropTypes.number.isRequired,
            members: PropTypes.arrayOf(PropTypes.string).isRequired,
            all: PropTypes.bool.isRequired,
            created: PropTypes.instanceOf(Date).isRequired,
            updated: PropTypes.instanceOf(Date).isRequired,
        }).isRequired,
        stream: PropTypes.shape({
            chartID: PropTypes.string.isRequired,
            streamID: PropTypes.string.isRequired,
            channels: PropTypes.arrayOf(PropTypes.string).isRequired,
            socket: PropTypes.object.isRequired,
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
        const fetchUsage = () => this.props.fetchUsage();

        const points = this.getPoints(stream.results, false);

        return (
            <Grid columns={2}>
                <Grid.Column width={2}>
                    <Button.Group vertical>
                        <Button content='Stream' onClick={fetchUsage} disabled={stream.connected} />
                        <Button content='Disconnect' onClick={this.props.disconnect} disabled={!stream.connected} />
                    </Button.Group>
                </Grid.Column>
                <Grid.Column width={14}>
                </Grid.Column>
            </Grid>

        );
    }
}
