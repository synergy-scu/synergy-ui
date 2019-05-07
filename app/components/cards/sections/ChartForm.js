import React from 'react';
import PropTypes from 'prop-types';
import MomentProps from 'react-moment-proptypes';
import { Form, Checkbox, Button, Header } from 'semantic-ui-react';
import { capitalize } from 'lodash';

import { ChartTypes, ChartOptions, ExtendedChartOptions, UsageTypes } from '../../../api/constants/ChartTypes';
import { HistoricalDatePicker } from './HistoricalDatePicker';

const ChartDropdownOptions = Object.keys(ChartTypes)
    .map(key => {
        return {
            key,
            value: key.toUpperCase(),
            text: capitalize(key),
            icon: ChartOptions[key].icon,
        };
    }).slice(0, Object.keys(ChartTypes).length - 1);

export const ChartForm = props => {
    const selectedChartOptions = ExtendedChartOptions[props.selected];

    return (
        <Form style={{ marginBottom: 0 }}>
            <Header content='Chart Settings' />
            <Form.Input fluid
                className='no-margin-bottom'
                label='Chart Name'
                value={props.name}
                placeholder='Chart Name'
                onChange={props.onNameChange} />
            <span className='secondary block-span margin-bottom' style={{ marginLeft: '0.5em' }}>Names must be at least 3 characters long</span>
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
            {
                props.usageType === UsageTypes.HISTORICAL &&
                    <Form.Field className='no-margin-bottom'>
                        <label>Date</label>
                        <HistoricalDatePicker
                            usePortal
                            startDate={props.startDate}
                            endDate={props.endDate}
                            onDateChange={props.onDateChange} />
                    </Form.Field>
            }
            <span className='secondary block-span' style={{ marginLeft: '0.5em' }}>You must choose at least one date</span>
            <span className='secondary block-span margin-bottom' style={{ marginLeft: '0.5em' }}>Leave one blank to specify all dates before/after</span>
            <Button fluid
                color='green'
                content={`${capitalize(props.menuType)} Chart`}
                disabled={props.isSubmitDisabled}
                onClick={props.onSubmit} />
        </Form>
    );
};

ChartForm.defaultProps = {
    isModal: false,
    isSubmitDisabled: true,
    startDate: null,
    endDate: null,
};

ChartForm.propTypes = {
    isModal: PropTypes.bool,
    isSubmitDisabled: PropTypes.bool,
    menuType: PropTypes.PropTypes.oneOf(['create', 'update']).isRequired,
    usageType: PropTypes.oneOf(Object.values(UsageTypes)).isRequired,

    name: PropTypes.string.isRequired,
    selected: PropTypes.oneOf(Object.values(ChartTypes)).isRequired,
    options: PropTypes.objectOf(PropTypes.bool).isRequired,
    startDate: MomentProps.momentObj,
    endDate: MomentProps.momentObj,

    onNameChange: PropTypes.func.isRequired,
    onSelectChart: PropTypes.func.isRequired,
    onCheckChartOption: PropTypes.func.isRequired,
    onDateChange: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
};
