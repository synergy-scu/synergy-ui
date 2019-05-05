import React from 'react';
import PropTypes from 'prop-types';
import MomentProps from 'react-moment-proptypes';
import moment from 'moment';

import { DateRangePicker, isSameDay, isInclusivelyBeforeDay } from 'react-dates';

const START_DATE = 'START_DATE';
const END_DATE = 'END_DATE';

export class HistoricalDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focusedInput: null,
        };
    }

    static defaultProps = {
        usePortal: false,
        startDate: null,
        endDate: null,
    };

    static propTypes = {
        usePortal: PropTypes.bool,
        startDate: MomentProps.momentObj,
        endDate: MomentProps.momentObj,
        onDateChange: PropTypes.func.isRequired,
    };

    onFocusChange = focusedInput => {
        this.setState({
            focusedInput,
        });
    };

    isOutsideRange = day => !isInclusivelyBeforeDay(day, moment());

    isDayHighlighted = day => isSameDay(day, moment());

    render() {
        return (
            <DateRangePicker noBorder hideKeyboardShortcutsPanel
                showClearDates={false}
                openDirection='up'
                withPortal={this.props.usePortal}
                startDate={this.props.startDate}
                startDateId={START_DATE}
                endDate={this.props.endDate}
                endDateId={END_DATE}
                numberOfMonths={2}
                onDatesChange={this.props.onDateChange}
                focusedInput={this.state.focusedInput}
                onFocusChange={this.onFocusChange}
                isOutsideRange={this.isOutsideRange}
                isDayHighlighted={this.isDayHighlighted} />
        );
    }
}
