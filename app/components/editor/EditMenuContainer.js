import { connect } from 'react-redux';
import { withAxios } from 'react-axios';
import { get } from 'lodash';

import { EditMenu } from './EditMenu';
import ActionCreators from '../../actions';

export const mapState = state => {
    return {
        entities: state.entities,
    };
};

export const mapDispatch = dispatch => {
    return {
        createChart: createChartParams => dispatch(ActionCreators.createChart(createChartParams)),
        updateChart: updateChartParams => dispatch(ActionCreators.updateChart(updateChartParams)),
        createGroup: createGroupParams => dispatch(ActionCreators.createGroup(createGroupParams)),
        updateGroup: updateGroupParams => dispatch(ActionCreators.updateGroup(updateGroupParams)),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const dispatchPropFnMapping = {
        group: ownProps.menuType === 'create' ? dispatchProps.createGroup : dispatchProps.updateGroup,
        chart: ownProps.menuType === 'create' ? dispatchProps.createChart : dispatchProps.updateChart,
        none: () => console.error('Incorrect props passed to Edit Menu'),
    };

    const submitFn = get(dispatchPropFnMapping, ownProps.groupType, dispatchPropFnMapping.none);

    const submit = submitParams => {
        console.warn('111', submitParams);
        if (submitParams.startDate) {
            submitParams.options.startDate = submitParams.startDate.hour(0).toISOString(true);
        }

        if (submitParams.endDate) {
            submitParams.options.endDate = submitParams.endDate.hour(0).toISOString(true);
        }

        delete submitParams.startDate;
        delete submitParams.endDate;

        console.warn('222', submitParams);
        submitFn({
            axios: ownProps.axios,
            ...submitParams,
        });
    };

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        submit,
    };
};

export default withAxios(connect(mapState, mapDispatch, mergeProps)(EditMenu));
