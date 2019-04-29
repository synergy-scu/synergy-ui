import { connect } from 'react-redux';
import { withAxios } from 'react-axios';

import { AddMenu } from '../settings/menus/AddMenu';
import ActionCreators from '../../actions';

export const mapState = state => {
    return {
        entities: state.entities,
    };
};

export const mapDispatch = dispatch => {
    return {
        create: createChartParams => dispatch(ActionCreators.createChart(createChartParams)),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const create = ({ name, members, chartType, usageType, options }) => dispatchProps.create({
        axios: ownProps.axios,
        name,
        members,
        chartType,
        usageType,
        options,
    });

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        create,
    };
};

export default withAxios(connect(mapState, mapDispatch, mergeProps)(AddMenu));
