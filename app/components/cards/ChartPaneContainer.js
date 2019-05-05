import { connect } from 'react-redux';
import { withAxios } from 'react-axios';

import ActionCreators from '../../actions';
import { ChartPane } from './ChartPane';
import { UsageTypes } from '../../api/constants/ChartTypes';
import { extractGroupedMembers, getChannelsFromGroup } from '../../api/socket/usageUtils';

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

    const requestChart = chart => {
        const members = extractGroupedMembers(chart.members, stateProps.entities);
        const channels = getChannelsFromGroup(members);

        const variables = {};
        if (chart.options.startDate) {
            variables.startDate = chart.options.startDate;
        }

        if (chart.options.endDate) {
            variables.endDate = chart.options.endDate;
        }

        const requestFn = ownProps.usageType === UsageTypes.REALTIME ? dispatchProps.requestStream : dispatchProps.requestHistory;
        return requestFn({
            axios: ownProps.axios,
            chartID: chart.chartID,
            chartMeta: {
                chartType: chart.chartType,
                usageType: chart.usageType,
                ...chart.options,
            },
            variables,
            channels: [...channels.values()],
            members,
        });
    };

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        activeTab: chartSettings.chartsTab,
        isSidebarOpen: chartSettings.isSidebarOpen,
        selectedChart: chartSettings.selectedChart,
        requestChart,

        changeTab: tab => dispatchProps.changeTab(ownProps.usageType, tab),
        toggleSidebar: isVisible => dispatchProps.toggleSidebar(ownProps.usageType, isVisible),
        changeChart: chart => dispatchProps.changeChart(ownProps.usageType, chart),
    };
};

export default withAxios(connect(mapState, mapDispatch, mergeProps)(ChartPane));
