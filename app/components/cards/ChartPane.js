import React from 'react';
import PropTypes from 'prop-types';
import { } from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import memoize from 'memoize-one';

import { ResponsiveLine } from '@nivo/line';
import { timeFormat } from 'd3-time-format';
import { last, maxBy, minBy, isEqual } from 'lodash';


export class ChartPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartID: uuidv4(),
            chartType: 'line',
            usageType: 'all',
        };
        this.formatTime = timeFormat('%I:%M% %p');
    }

    static propTypes = {
        cumulative: PropTypes.arrayOf(PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
        })).isRequired,
        fetchUsage: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.next();
        this.timer = setInterval(this.next, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    next = (limit = 1) => {
        this.props.fetchUsage({
            chartID: this.state.chartID,
            usageType: this.state.usageType,
            chartType: this.state.chartType,
            timeRange: {
                after: new Date().getTime() - 1000 - 7 * 60 * 60 * 1000,
            },
            limit,
        });
    }

    getPoints = memoize(points => points, isEqual);

    render() {
        const points = this.getPoints(this.props.cumulative || []);
        const maxY = points.length ? maxBy(points, 'y').y + 1 : 0;
        const minY = points.length ? minBy(points, 'y').y - 1 : 0;
        const currTime = new Date().getTime();

        return (
            <ResponsiveLine
                data={[{ id: 'Cumulative', data: points }]}
                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                xScale={{ type: 'time', format: '%Q' }}
                yScale={{ type: 'linear', min: minY, max: maxY }}
                enableGridX={false}
                enableDots={false}
                curve='monotoneX'
                animate={false}
                isInteractive={false}
                lineWidth={5}
                axisBottom={{
                    format: '%I:%M% %p',
                    legend: `${this.formatTime(currTime)}`,
                    legendOffset: 20,
                    legendPosition: 'end',
                    tickValues: 0,
                }}
                axisLeft={{
                    legend: 'kw/h',
                    legendOffset: -40,
                    legendPosition: 'middle',
                }}
                theme={{
                    grid: { line: { stroke: '#ddd', strokeDasharray: '1 2' } },
                }} />
        );
    }
}
