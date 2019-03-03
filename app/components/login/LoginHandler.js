import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Checkbox, Modal } from 'semantic-ui-react';

export const LoginFields = ({ email = '', password = '', saveSession = false }) => {
    return {
        email,
        password,
        saveSession,
    };
};

export const LoginFieldErrors = ({ email = false, password = false }) => {
    return {
        email,
        password,
    };
};

export class LoginHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: LoginFields({}),
            errors: LoginFieldErrors({}),
        };
    }

    static defaultProps = {
        isOpen: false,
    };

    static propTypes = {
        isOpen: PropTypes.bool,
        onLogin: PropTypes.func.isRequired,
        onNewUser: PropTypes.func.isRequired,
        toggleModal: PropTypes.func.isRequired,
    }

    onFieldChange = (event, { field, value }) => {
        this.setState({
            fields: LoginFields({
                ...this.state.fields,
                [field]: value,
            }),
        });
    };

    onCheckboxChange = (event, { checked }) => {
        this.setState({
            fields: LoginFields({
                ...this.state.fields,
                saveSession: checked,
            }),
        });
    };

    validateForm = () => {
        const errors = LoginFieldErrors({});
        Object.entries(this.state.fields).forEach(([key, value]) => {
            if (value === '') {
                errors[key] = true;
            }
        });

        this.setState({ errors });
        return !Object.values(errors).includes(true);
    }

    onLogin = () => {
        if (this.validateForm()) {
            const { email, password, saveSession } = this.state.fields;
            this.props.onLogin({ email, password, saveSession });
        }
    };

    render = () =>
        <Modal
            size='tiny'
            dimmer='blurring'
            open={this.props.isOpen}
            trigger={ <span style={{ display: 'none' }} /> }>
            <Modal.Header>Synergy Login</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input fluid
                        label='Email'
                        field='email'
                        onChange={this.onFieldChange}
                        value={this.state.fields.email}
                        error={this.state.errors.email} />
                    <Form.Input fluid
                        label='Password'
                        field='password'
                        onChange={this.onFieldChange}
                        value={this.state.fields.password}
                        error={this.state.errors.password} />
                    <Checkbox
                        label='Remember Me'
                        onChange={this.onCheckboxChange}
                        checked={this.state.fields.saveSession} />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button content='Cancel' onClick={this.props.toggleModal} />
                <Button content='Create New User' onClick={this.props.onNewUser} />
                <Button primary
                    type='submit'
                    content='Login'
                    onClick={this.onLogin} />
            </Modal.Actions>
        </Modal>;
}
