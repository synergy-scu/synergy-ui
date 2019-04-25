import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Modal } from 'semantic-ui-react';

import validator from 'email-validator';

export const NewUserFields = ({ name = '', email = '', password = '', confirmation = '', familySize = 1 }) => {
    return {
        name,
        email,
        password,
        confirmation,
        familySize,
    };
};

export const NewUserFieldErrors = ({ name = false, email = false, password = false, confirmation = false, familySize = false }) => {
    return {
        name,
        email,
        password,
        confirmation,
        familySize,
    };
};

export const familySizeOptions = () => new Array(10).fill(0).map((element, idx) => {
    return {
        key: `familysize-${idx + 1}`,
        value: idx + 1,
        text: idx + 1,
    };
});

export class NewUserHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: NewUserFields({}),
            errors: NewUserFieldErrors({}),
        };
    }

    static defaultProps = {
        isOpen: false,
    };

    static propTypes = {
        isOpen: PropTypes.bool,
        onCreateUser: PropTypes.func.isRequired,
        cancelNewUserModal: PropTypes.func.isRequired,
    };

    onFieldChange = (event, { field, value }) => {
        this.setState({
            fields: NewUserFields({
                ...this.state.fields,
                [field]: value,
            }),
            errors: NewUserFieldErrors({
                ...this.state.errors,
                [field]: false,
            }),
        });
    };

    validateForm = () => {
        const errors = NewUserFieldErrors({});
        Object.entries(this.state.fields).forEach(([key, value]) => {
            if (value === '') {
                errors[key] = true;
            }
            if (key === 'email') {
                errors.email = !validator.validate(value);
            }
            if (key === 'password' && value.length < 6) {
                errors.password = true;
            }
            if (key === 'password' && this.state.fields.confirmation !== value) {
                errors.password = true;
                errors.confirmation = true;
            }
            if (key === 'familySize' && (value < 1 || value > 10)) {
                errors.familySize = true;
            }
        });

        this.setState({ errors });
        return !Object.values(errors).includes(true);
    };

    onCreateUser = () => {
        if (this.validateForm()) {
            const { username, email, password, familySize } = this.state.fields;
            this.props.onCreateUser({ username, email, password, familySize });
        }
    };

    render = () =>
        <Modal
            size='small'
            dimmer='blurring'
            open={this.props.isOpen}
            trigger={<span style={{ display: 'none' }} />}>
            <Modal.Header>Create a New Synergy Account</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Input fluid
                            label='Name'
                            field='name'
                            onChange={this.onFieldChange}
                            value={this.state.fields.name}
                            error={this.state.errors.name} />
                        <Form.Input fluid
                            label='Email'
                            field='email'
                            onChange={this.onFieldChange}
                            value={this.state.fields.email}
                            error={this.state.errors.email} />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input fluid
                            label='Password'
                            field='password'
                            onChange={this.onFieldChange}
                            value={this.state.fields.password}
                            error={this.state.errors.password} />
                        <Form.Input fluid
                            label='Confirm Password'
                            onChange={this.onFieldChange}
                            value={this.state.fields.confirmation}
                            error={this.state.errors.confirmation} />
                    </Form.Group>
                    <Form.Dropdown compact selection scrolling
                        width={3}
                        label='Family Size'
                        field='familySize'
                        onChange={this.onFieldChange}
                        value={this.state.fields.familySize}
                        error={this.state.errors.familySize}
                        options={familySizeOptions()} />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button content='Cancel' onClick={this.props.cancelNewUserModal} />
                <Button primary
                    type='submit'
                    content='Create Account'
                    onClick={this.onCreateUser} />
            </Modal.Actions>
        </Modal>;
}
