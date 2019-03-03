import { connect } from 'react-redux';
import { withAxios } from 'react-axios';

import { UserHandler } from './UserHandler';
import ActionCreators from '../../actions';

export const mapState = state => {
    return {
        user: state.user,
    };
};

export const mapDispatch = dispatch => {
    return {
        onLogin: (email, password, saveSession, axios) => dispatch(ActionCreators.userLogin({ email, password, saveSession, axios })),
        onCreateUser: (name, email, password, familySize, axios) => dispatch(ActionCreators.createUser({ name, email, password, familySize, axios })),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        // Axios prop passed in from withAxios() HOC
        onLogin: (email, password, saveSession) => dispatchProps.onLogin(email, password, saveSession, ownProps.axios),
        onCreateUser: (name, email, password, familySize) => dispatchProps.onCreateUser(name, email, password, familySize, ownProps.axios),
    };
};

export default withAxios(connect(mapState, mapDispatch, mergeProps)(UserHandler));
