import { connect } from 'react-redux';

import ActionCreators from '../../actions';
import { ChartPane } from './ChartPane';

export const mapState = state => {
    return {
        entities: state.entities,
        streams: state.streams,
        activeTab: state.chartsTab,
        isSidebarOpen: state.isSidebarOpen,
    };
};

export const mapDispatch = dispatch => {
    return {
        changeTab: tab => dispatch(ActionCreators.changeChartTab(tab)),
        toggleSidebar: isVisible => dispatch(ActionCreators.setSidebarVisibility(isVisible)),
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
