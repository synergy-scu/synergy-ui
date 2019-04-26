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
    const create = () => dispatchProps.create({
        client: ownProps.axios,
    });

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        create,
    };
};

export default withAxios(connect(mapState, mapDispatch, mergeProps)(AddMenu));