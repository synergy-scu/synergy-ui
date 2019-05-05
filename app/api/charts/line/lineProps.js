/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { round, maxBy } from 'lodash';
import { UsageTypes } from '../../constants/ChartTypes';
import { PeriodFormatter } from '../../constants/ChartOptions';

export const lineProps = {
    margin: {
        top: 10,
        right: 0,
        bottom: 40,
        left: 60,
    },
    xScale: {
        type: 'time',
        format: '%Q',
    },
    curve: 'monotoneX',
    lineWidth: 5,
    enableGrid: false,
    enableDots: false,
    animate: false,
    isInteractive: false,
    axisLeft: {
        legend: 'Amps',
        legendOffset: -40,
        legendPosition: 'middle',
    },
    theme: {
        grid: {
            line: {
                stroke: '#DDD',
                strokeDasharray: '1 2',
            },
        },
    },
    // legends: [
    //     {
    //         anchor: 'left',
    //         direction: 'column',
    //         justify: false,
    //         translateX: -69,
    //         translateY: -5,
    //         itemWidth: 10,
    //         itemHeight: 23,
    //         itemsSpacing: 0,
    //         symbolSize: 17,
    //         symbolShape: 'circle',
    //         itemDirection: 'right-to-left',
    //         itemTextColor: '#777',
    //     },
    // ],
};

export const linePropTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    lines: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        })),
    })),
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }),
    xScale: PropTypes.shape({
        type: PropTypes.string,
        format: PropTypes.string,
    }),
    curve: PropTypes.string,
    lineWidth: PropTypes.number,
    enableGrid: PropTypes.bool,
    enableDots: PropTypes.bool,
    animate: PropTypes.bool,
    isInteractive: PropTypes.bool,
    axisLeft: PropTypes.shape({
        legend: PropTypes.string,
        legendOffset: PropTypes.number,
        legendPosition: PropTypes.string,
    }),
    theme: PropTypes.object,
    markers: PropTypes.arrayOf(PropTypes.shape({
        axis: PropTypes.string,
        value: PropTypes.number,
        lineStyle: PropTypes.object,
        legend: PropTypes.string,
    })),
    enableArea: PropTypes.bool,
    layers: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export const showAverageLine = (lines, names) => {
    const averages = lines.map(line => {
        return {
            uuid: line.id,
            average: line.data.reduce((acc, point) => acc + point.y, 0),
        };
    });

    return averages.map(({ uuid, average }) => {
        const marker = {
            axis: 'y',
            value: round(average / lines.length, 2),
            lineStyle: {
                stroke: '#B0413E',
                strokeDasharray: '1 2',
                strokeWidth: 2,
            },
        };

        if (averages.length <= 5 && names.has(uuid)) {
            marker.legend = names.get(uuid);
        }

        return marker;
    });
};

export const showArea = {
    enableArea: true,
};

export const showUsageScale = maxY => {
    const usageScale = props => {
        const colors = [
            'rgba(255, 0, 0, 0.15)',
            'rgba(242, 113, 28, 0.15)',
            'rgba(251, 189, 8, 0.15)',
            'rgba(255, 0, 0, 0.15)',
        ];

        let height = 5;
        return (
            <g>
                {
                    colors.map((color, idx) => {
                        if (idx === 0) {
                            return (
                                <rect
                                    y={height}
                                    width={props.width}
                                    height={5}
                                    fill={color} />
                            );
                        } else if (maxY > height) {
                            return (
                                <rect
                                    y={Math.min([maxY, height])}
                                    width={props.width}
                                    height={maxY - height}
                                    fill={color} />
                            );
                        }
                        height += 5;
                        return null;
                    })
                }
            </g>
        );
    };

    return {
        layers: [
            'grid',
            usageScale,
            'markers',
            'axes',
            'areas',
            'lines',
            'legends',
        ],
    };
};

export const getMaxY = (lines, multiplier) => {
    if (!Array.isArray(lines)
        || !lines.length
        || !lines[0].hasOwnProperty('data')
        || !Array.isArray(lines[0].data)
        || !lines[0].data.length) {
        return 1;
    }

    let maxY = Number.MIN_SAFE_INTEGER;
    lines.forEach(line => {
        const max = maxBy(line.data, 'y').y;
        maxY = Math.max(maxY, max);
    });

    if (maxY * multiplier < 1) {
        return 1;
    }

    return maxY * multiplier;
};

export const getTimeFormat = (format, usageType) => usageType === UsageTypes.REALTIME ? PeriodFormatter[usageType] : PeriodFormatter[format];
