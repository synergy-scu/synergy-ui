import React from 'react';
import PropTypes from 'prop-types';
import { Form, Checkbox, Button, Header } from 'semantic-ui-react';

import { ChartTypes, ChartOptions, ExtendedChartOptions } from '../../../api/constants/ChartTypes';
import { capitalize } from '../../../api/utils';

const ChartDropdownOptions = Object.keys(ChartTypes)
    .map(key => {
        const type = key.toLowerCase();
        return { key, value: type.toUpperCase(), text: capitalize(type), icon: ChartOptions[key].icon };
    }).slice(0, Object.keys(ChartTypes).length - 1);

export const ChartForm = props => {
    const selectedChartOptions = ExtendedChartOptions[props.selected];

    return (
        <Form style={{ marginBottom: 0 }}>
            <Header content='Chart Settings' />
            <Form.Input fluid
                className='has-help-text'
                label='Chart Name'
                value={props.name}
                placeholder='Chart Name'
                onChange={props.onNameChange} />
            <span className='secondary help-text' style={{ marginLeft: '0.5em' }}>Names must be at least 3 characters long</span>
            <Form.Dropdown fluid selection clearable
                label='Chart Type'
                placeholder='Chart Type'
                value={props.selected === ChartTypes.NONE ? '' : selectedChartOptions.verbiage.name}
                onChange={props.onSelectChart}
                options={ChartDropdownOptions} />
            {
                [...selectedChartOptions.options.entries()].map(([option, message]) =>
                    <Form.Field key={option} className='split'>
                        <label>{message}</label>
                        <Checkbox toggle
                            chart={selectedChartOptions.verbiage.toLower}
                            option={option}
                            checked={props.options[option] || false}
                            onChange={props.onCheckChartOption} />
                    </Form.Field>
                )
            }
            <Button fluid
                color='green'
                content='Create Chart'
                disabled={props.isSubmitDisabled}
                onClick={props.onSubmit} />
        </Form>
    );
};

ChartForm.defaultProps = {
    isSubmitDisabled: true,
};

ChartForm.propTypes = {
    isSubmitDisabled: PropTypes.bool,
    name: PropTypes.string.isRequired,
    selected: PropTypes.oneOf(Object.values(ChartTypes)).isRequired,
    options: PropTypes.objectOf(PropTypes.bool).isRequired,
    onNameChange: PropTypes.func.isRequired,
    onSelectChart: PropTypes.func.isRequired,
    onCheckChartOption: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
