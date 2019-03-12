import React from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import { NewUserHandler } from './NewUserHandler';
import { LoginHandler } from './LoginHandler';

export class UserHandler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoginModal: (this.props.user === '' || this.props.user === 'unauthorized') && false,
            isNewUserModal: false,
        };
    }

    static propTypes = {
        user: PropTypes.string,
        onLogin: PropTypes.func.isRequired,
        onCreateUser: PropTypes.func.isRequired,
    };

    onToggleLoginModal = () => this.setState({ isLoginModal: !this.state.isLoginModal });

    onToggleNewUserModal = () => this.setState({ isNewUserModal: !this.state.isNewUserModal });

    openNewUser = () => {
        this.setState({ isLoginModal: false });
        const self = this;
        setTimeout(() => {
            self.setState({ isNewUserModal: true });
        }, 100);
    };

    onLogin = ({ email, password, saveSession }) => {
        this.props.onLogin({ email, password, saveSession, axios: this.props.axios });
    }

    render = () =>
        <React.Fragment>
            <LoginHandler
                isOpen={this.state.isLoginModal}
                toggleModal={this.onToggleLoginModal}
                onNewUser={this.openNewUser}
                onLogin={this.onLogin} />
            <NewUserHandler
                isOpen={this.state.isNewUserModal}
                toggleModal={this.onToggleNewUserModal}
                onCreateUser={this.onCreateUser} />
        </React.Fragment>

}
