import { connect } from 'react-redux';

import ActionCreators from '../../../actions';

import { defaultStream } from '../../../api/socket/usageUtils';
import { defaultHistoryChart } from '../../../api/chartProps';
import { ExtendedUsageOptions } from '../../../api/constants/ChartTypes';

export const mapState = state => {
    return {
        user: state.user,
        entities: state.entities,
        streams: state.streams,
        histories: state.histories,
    };
};

export const mapDispatch = dispatch => {
    return {
        pauseStream: (chartID, shouldPause) => dispatch(ActionCreators.streamPause(chartID, shouldPause)),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const dataMapper = {
        REALTIME: stateProps.streams.get(ownProps.chart.uuid) || defaultStream({}),
        HISTORICAL: stateProps.histories.get(ownProps.chart.uuid) || defaultHistoryChart({}),
    };

    const chartSet = dataMapper[ExtendedUsageOptions[ownProps.usageType].verbiage.name];

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        chartSet,
    };
};

export default chart => connect(mapState, mapDispatch, mergeProps)(chart);
