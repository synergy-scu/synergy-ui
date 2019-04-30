import { connect } from 'react-redux';
import { withAxios } from 'react-axios';

import ActionCreators from '../../../actions';

import { defaultStream, extractGroupedMembers, getChannelsFromGroup } from '../../../api/socket/usageUtils';
import { defaultChart } from '../../../api/constants/ChartTypes';

export const mapState = state => {
    return {
        user: state.user,
        entities: state.entities,
        streams: state.streams,
    };
};

export const mapDispatch = dispatch => {
    return {
        fetchUsage: fetchParams => dispatch(ActionCreators.requestStream(fetchParams)),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const chart = stateProps.entities.charts.get(ownProps.chartID) || defaultChart({});
    const stream = stateProps.streams.get(ownProps.chartID) || defaultStream({});

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        stream,
        chart,

        disconnect: () => stream.socket.disconnect(),
        fetchUsage: ({ chartMeta = {}, variables = {} }) => {
            const members = extractGroupedMembers(chart.members, stateProps.entities);
            const channels = getChannelsFromGroup(members);

            return dispatchProps.fetchUsage({
                axios: ownProps.axios,
                chartID: ownProps.chartID,
                chartMeta: {
                    chartType: chart.chartType,
                    usageType: chart.usageType,
                    ...chart.options,
                    ...chartMeta,
                },
                variables,
                channels: [...channels.values()],
                members,
            });
        },
    };
};

export default chart => withAxios(connect(mapState, mapDispatch, mergeProps)(chart));
