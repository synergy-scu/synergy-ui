import PropTypes from 'prop-types';

export const pieProps = {
    margin: {
        top: 10,
        right: 0,
        bottom: 40,
        left: 60,
    },
    padAngle: 0.7,
    cornerRadius: 3,
    slicesLabelsSkipAngle: 10,
    radialLabel: segment => segment.label,
};

export const noDataProps = {
    innerRadius: 0.95,
    padAngle: 0,
    cornerRadius: 0,
    enableRadialLabels: false,
    enableSlicesLabels: false,
};

export const donutProps = {
    innerRadius: 0.45,
};

export const piePropTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    slices: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        color: PropTypes.string,
    }).isRequired,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }),
    padAngle: PropTypes.number,
    cornerRadius: PropTypes.number,
    innerRadius: PropTypes.number,
    slicesLabelsSkipAngle: PropTypes.number,
    enableRadialLabels: PropTypes.bool,
    enableSlicesLabels: PropTypes.bool,
};
