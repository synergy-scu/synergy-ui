import { connect } from 'react-redux';
import { withAxios } from 'react-axios';

import ActionCreators from '../../actions';
import { ChartPane } from './ChartPane';

export const mapState = state => {
    return {
        entities: state.entities,
        cumulative: state.cumulative,
    };
};

export const mapDispatch = dispatch => {
    return {
        // eslint-disable-next-line max-params
        fetchUsage: (axios, chartID, usageType, chartType, timeRange, limit) => dispatch(ActionCreators.fetchUsage({
            axios,
            chartID,
            usageType,
            chartType,
            timeRange,
            limit,
        })),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        fetchUsage: ({ chartID, usageType, chartType, timeRange, limit }) => dispatchProps.fetchUsage(
            ownProps.axios,
            chartID,
            usageType,
            chartType,
            timeRange,
            limit,
        ),
    };
};

export default withAxios(connect(mapState, mapDispatch, mergeProps)(ChartPane));
