import React, { useState, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface PredefinedRange {
  label: string;
  days?: number;
  type?: 'thisMonth' | 'lastMonth';
}

const predefinedRanges: PredefinedRange[] = [
  { label: 'Laatste 7 dagen', days: 7 },
  { label: 'Laatste 28 dagen', days: 28 },
  { label: 'Laatste 30 dagen', days: 30 },
  { label: 'Deze maand', type: 'thisMonth' },
  { label: 'Vorige maand', type: 'lastMonth' }
];

interface DatePickerProps {
  selected: Date;
  onChange: (date: Date | null) => void;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  startDate: Date;
  endDate: Date;
  minDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({ /* props */ }) => {
  // ... component implementatie
};

const DateRangePicker: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleRangeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedRange = predefinedRanges.find(range => range.label === e.target.value);
    if (!selectedRange) return;

    const endDate = new Date();
    let startDate = new Date();

    if (selectedRange.days) {
      startDate.setDate(endDate.getDate() - selectedRange.days);
    } else if (selectedRange.type === 'thisMonth') {
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    } else if (selectedRange.type === 'lastMonth') {
      startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
      endDate.setDate(0); // Laatste dag van vorige maand
    }

    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleDateChange = (date: Date | null, type: 'start' | 'end') => {
    if (date) {
      type === 'start' ? setStartDate(date) : setEndDate(date);
    }
  };

  return (
    <div className="date-range-picker">
      <select onChange={handleRangeChange}>
        {predefinedRanges.map(range => (
          <option key={range.label} value={range.label}>
            {range.label}
          </option>
        ))}
      </select>
      
      <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => handleDateChange(date, 'start')}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
      <DatePicker
        selected={endDate}
        onChange={(date: Date | null) => handleDateChange(date, 'end')}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      />
    </div>
  );
};

export default DateRangePicker; 