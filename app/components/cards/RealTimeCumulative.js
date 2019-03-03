import React from 'react';
import PropTypes from 'prop-types';

import { ResponsiveLine } from '@nivo/line';
import { timeFormat } from 'd3-time-format';
import { range, last, maxBy, random } from 'lodash';

export class RealTimeCumulative extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            values: range(150).map(() => {
                return {
                    x: new Date().getTime(),
                    y: 8,
                };
            }),
        };

        this.formatTime = timeFormat('%I:%M% %p');
    }

    componentDidMount() {
        this.timer = setInterval(this.next, 250);
    }

    omponentWillUnmount() {
        clearInterval(this.timer);
    }

    next = () => {
        const values = this.state.values.slice(1);
        const lastValue = last(values).y;
        let nextValue = lastValue;
        if (random(1)) {
            if (random(1)) {
                nextValue = lastValue + random(1, true);
                if (nextValue > 16) {
                    nextValue = 16;
                }
            } else {
                nextValue = lastValue - 1;
                if (nextValue < 0) {
                    nextValue = 0;
                }
            }
        }
        values.push({
            x: new Date().getTime(),
            y: nextValue,
        });

        this.setState({ values });
    };

    render() {
        const { values } = this.state;
        const maxY = maxBy(values, 'y').y;

        const currTime = new Date(last(values).x);
        const END_OF_LINE_OFFSET = 12500; // 12.5 seconds after the end of the graph

        return (
            <ResponsiveLine
                data={[{ id: 'Cumulative', data: values }]}
                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                xScale={{ type: 'time', format: '%Q' }}
                yScale={{ type: 'linear', min: -1, max: 17 }}
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
