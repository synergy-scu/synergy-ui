import { connect } from 'react-redux';
import { withAxios } from 'react-axios';

import { UserHandler } from './UserHandler';
import ActionCreators from '../../actions';

export const mapState = state => {
    return {
        user: state.user,
        userID: state.userID,
        isLoginModalOpen: state.isLoginModalOpen,
        isNewUserModalOpen: state.isNewUserModalOpen,
    };
};

export const mapDispatch = dispatch => {
    return {
        toggleLoginModal: (isOpen = null) => dispatch(ActionCreators.toggleLoginModal(isOpen)),
        toggleNewUserModal: (isOpen = null) => dispatch(ActionCreators.toggleNewUserModal(isOpen)),

        onLogin: loginParams => dispatch(ActionCreators.userLogin(loginParams)),
        onCreateUser: newUserParams => dispatch(ActionCreators.createUser(newUserParams)),
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,

        // Axios prop passed in from withAxios() HOC
        onLogin: ({ email, password, saveSession }) => dispatchProps.onLogin({ email, password, saveSession, axios: ownProps.axios }),
        onCreateUser: ({ name, email, password, familySize }) => dispatchProps.onCreateUser({ name, email, password, familySize, axios: ownProps.axios }),
    };
};

export default withAxios(connect(mapState, mapDispatch, mergeProps)(UserHandler));
