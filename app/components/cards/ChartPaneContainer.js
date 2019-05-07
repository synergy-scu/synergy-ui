import { connect } from 'react-redux';
import { withAxios } from 'react-axios';

import ActionCreators from '../../actions';
import { ChartPane } from './ChartPane';
import { UsageTypes, defaultChart } from '../../api/constants/ChartTypes';
import { extractGroupedMembers, getChannelsFromGroup } from '../../api/socket/usageUtils';
import { fetchChart } from '../../api/charts';

export const mapState = state => {
    return {
        entities: state.entities,
        streams: state.streams,
        realtime: state.realtime,
        historical: state.historical,
    };
};

export const mapDispatch = dispatch => {
    return {
        changeTab: (type, tab) => dispatch(ActionCreators.changeChartTab(type, tab)),
        toggleSidebar: (type, isVisible) => dispatch(ActionCreators.setSidebarVisibility(type, isVisible)),
        changeChart: (type, chart) => dispatch(ActionCreators.changeChart(type, chart)),
        requestHistory: chartParams => dispatch(ActionCreators.requestHistory(chartParams)),
        requestStream: chartParams => dispatch(ActionCreators.requestStream(chartParams)),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const chartSettings = ownProps.usageType === UsageTypes.REALTIME ? stateProps.realtime : stateProps.historical;

    const requestChart = chart => fetchChart({
        axios: ownProps.axios,
        usageType: ownProps.usageType,
        chartID: chart.uuid,
        entities: stateProps.entities,
        requestStream: dispatchProps.requestStream,
        requestHistory: dispatchProps.requestHistory,
    });

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        activeTab: chartSettings.chartsTab,
        isSidebarOpen: chartSettings.isSidebarOpen,
        selectedChart: chartSettings.selectedChart,
        chart: stateProps.entities.charts.get(chartSettings.selectedChart) || defaultChart({}),
        requestChart,

        changeTab: tab => dispatchProps.changeTab(ownProps.usageType, tab),
        toggleSidebar: isVisible => dispatchProps.toggleSidebar(ownProps.usageType, isVisible),
        changeChart: chart => dispatchProps.changeChart(ownProps.usageType, chart),
    };
};

export default withAxios(connect(mapState, mapDispatch, mergeProps)(ChartPane));
