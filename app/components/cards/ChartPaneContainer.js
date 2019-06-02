import { connect } from 'react-redux';
import { withAxios } from 'react-axios';

import ActionCreators from '../../actions';
import { ChartPane } from './ChartPane';
import { UsageTypes, defaultChart } from '../../api/constants/ChartTypes';
import { fetchChart } from '../../api/charts';

export const mapState = state => {
    return {
        entities: state.entities,
        streams: state.streams,
        histories: state.histories,
        realtime: state.realtime,
        historical: state.historical,
    };
};

export const mapDispatch = dispatch => {
    return {
        changeTab: (type, tab) => dispatch(ActionCreators.changeChartTab(type, tab)),
        toggleSidebar: (type, isVisible) => dispatch(ActionCreators.setSidebarVisibility(type, isVisible)),
        changeChart: (type, chart, isCumulative) => dispatch(ActionCreators.changeChart(type, chart, isCumulative)),
        requestHistory: chartParams => dispatch(ActionCreators.requestHistory(chartParams)),
        requestStream: chartParams => dispatch(ActionCreators.requestStream(chartParams)),
        pauseStream: (chartID, shouldPause) => dispatch(ActionCreators.streamPause(chartID, shouldPause)),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const chartSettings = ownProps.usageType === UsageTypes.REALTIME ? stateProps.realtime : stateProps.historical;
    const { chartsTab, isSidebarOpen, selectedChart, cumulativeChart, isCumulative } = chartSettings;

    const requestChart = (chartID, isCumulativeChart = false) => fetchChart({
        axios: ownProps.axios,
        usageType: ownProps.usageType,
        chartID,
        entities: stateProps.entities,
        requestStream: dispatchProps.requestStream,
        requestHistory: dispatchProps.requestHistory,
        isCumulative: isCumulativeChart,
    });

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        activeTab: chartsTab,
        isSidebarOpen,
        selectedChart,
        cumulativeChart,
        isCumulative,

        chart: isCumulative ? cumulativeChart : stateProps.entities.charts.get(selectedChart) || defaultChart({}),
        requestChart,

        changeTab: tab => dispatchProps.changeTab(ownProps.usageType, tab),
        toggleSidebar: isVisible => dispatchProps.toggleSidebar(ownProps.usageType, isVisible),
        changeChart: (chart, isCumulativeChart) => dispatchProps.changeChart(ownProps.usageType, chart, isCumulativeChart),
    };
};

export default withAxios(connect(mapState, mapDispatch, mergeProps)(ChartPane));
