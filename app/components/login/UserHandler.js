import React from 'react';
import PropTypes from 'prop-types';

import { NewUserHandler } from './NewUserHandler';
import { LoginHandler } from './LoginHandler';

export class UserHandler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    static propTypes = {
        user: PropTypes.shape({
            userID: PropTypes.number,
            name: PropTypes.string,
            email: PropTypes.string,
        }).isRequired,
        isLoginModalOpen: PropTypes.bool.isRequired,
        isNewUserModalOpen: PropTypes.bool.isRequired,
        onLogin: PropTypes.func.isRequired,
        onCreateUser: PropTypes.func.isRequired,
        toggleLoginModal: PropTypes.func.isRequired,
        toggleNewUserModal: PropTypes.func.isRequired,
    };

    openNewUserModal = () => {
        this.props.toggleLoginModal(false);
        this.props.toggleNewUserModal(true);
    };

    cancelNewUserModal = () => {
        this.props.toggleNewUserModal(false);
        this.props.toggleLoginModal(true);
    };

    render = () =>
        <React.Fragment>
            <LoginHandler
                isOpen={this.props.isLoginModalOpen}
                openNewUserModal={this.openNewUserModal}
                onLogin={this.props.onLogin} />
            <NewUserHandler
                isOpen={this.props.isNewUserModalOpen}
                cancelNewUserModal={this.cancelNewUserModal}
                onCreateUser={this.props.onCreateUser} />
        </React.Fragment>

}
