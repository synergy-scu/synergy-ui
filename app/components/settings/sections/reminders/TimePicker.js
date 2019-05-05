import React from 'react';
import PropTypes from 'prop-types';
import { Input, Dropdown, Button } from 'semantic-ui-react';

const timeSelectorOptions = [
    { key: 'am', value: 'am', text: 'AM' },
    { key: 'pm', value: 'pm', text: 'PM' },
];

export const TimePicker = props =>
    <div className='time-picker'>
        <Input fluid
            placeholder='HH (0-12)'
            field='hour'
            value={props.time.hour}
            onChange={props.onTimeChange} />
        <span className='separator'>:</span>
        <Input fluid
            placeholder='MM (0-59)'
            field='minute'
            labelPosition='right'
            label={
                <Dropdown compact
                    field='period'
                    value={props.time.period}
                    options={timeSelectorOptions}
                    onChange={props.onTimeChange} />
            }
            value={props.time.minute}
            onChange={props.onTimeChange} />
    </div>;

TimePicker.propTypes = {
    time: PropTypes.shape({
        hour: PropTypes.string.isRequired,
        minute: PropTypes.string.isRequired,
        period: PropTypes.string.isRequired,
    }).isRequired,
    onTimeChange: PropTypes.func.isRequired,
};
