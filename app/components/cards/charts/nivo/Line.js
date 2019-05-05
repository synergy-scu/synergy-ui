import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Line } from '@nivo/line';
import { timeFormat } from 'd3-time-format';

import { lineProps, linePropTypes } from '../../../../api/charts/line/lineProps';

const formatTime = timeFormat('%I:%M %p');

export const RealtimeLine = props =>
    <Line
        {...lineProps}
        height={props.height}
        width={props.width}
        data={props.lines}
        yScale={{ type: 'linear', min: 0, max: props.maxY }}
        enableGridX={false}
        axisBottom={{
            legend: `${formatTime(moment().valueOf())}`,
            legendOffset: 20,
            legendPosition: 'end',
            tickValues: 0,
        }} />;

RealtimeLine.propTypes = {
    ...linePropTypes,
    maxY: PropTypes.number.isRequired,
};

export const HistoricalLine = props =>
    <Line
        {...lineProps}
        height={props.height}
        width={props.width}
        data={props.lines}
        yScale={{ type: 'linear', min: 0, max: props.maxY }}
        axisBottom={{
            format: props.format,
            tickRotation: -40,
        }} />;

HistoricalLine.propTypes = {
    ...linePropTypes,
    format: PropTypes.string,
    maxY: PropTypes.number.isRequired,
};
