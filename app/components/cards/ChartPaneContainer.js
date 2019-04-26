import { connect } from 'react-redux';

import ActionCreators from '../../actions';
import { ChartPane } from './ChartPane';

export const mapState = state => {
    return {
        entities: state.entities,
        streams: state.streams,
        chartsTab: state.chartsTab,
    };
};

export const mapDispatch = dispatch => {
    return {
        changeTab: tabIndex => dispatch(ActionCreators.changeChartTab(tabIndex)),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
    };
};

export default connect(mapState, mapDispatch, mergeProps)(ChartPane);
