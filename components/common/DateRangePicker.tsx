import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="date-range-picker">
      <div className="date-picker-container">
        <label htmlFor="start-date">Startdatum</label>
        <ReactDatePicker
          id="start-date"
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
        />
      </div>
      
      <div className="date-picker-container">
        <label htmlFor="end-date">Einddatum</label>
        <ReactDatePicker
          id="end-date"
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="dd/MM/yyyy"
        />
      </div>
    </div>
  );
};

export default DateRangePicker; 