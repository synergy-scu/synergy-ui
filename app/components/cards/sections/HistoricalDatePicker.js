import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DateRangePicker, isSameDay, isInclusivelyBeforeDay } from 'react-dates';

const START_DATE = 'START_DATE';
const END_DATE = 'END_DATE';

export class HistoricalDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: null,
            endDate: null,
            focusedInput: null,
        };
    }

    onDateChange = ({ startDate, endDate }) => {
        this.setState({
            startDate,
            endDate,
        });
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
            <DateRangePicker noBorder withPortal showClearDates
                startDate={this.state.startDate}
                startDateId={START_DATE}
                endDate={this.state.endDate}
                endDateId={END_DATE}
                numberOfMonths={1}
                onDatesChange={this.onDateChange}
                focusedInput={this.state.focusedInput}
                onFocusChange={this.onFocusChange}
                isOutsideRange={this.isOutsideRange}
                isDayHighlighted={this.isDayHighlighted} />
        );
    }
}
