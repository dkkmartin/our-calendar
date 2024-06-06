'use client';

import { useState } from 'react';
import { Calendar } from '../ui/calendar';

export default function CalendarPicker() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="border-2 border-black rounded max-w-[280px] flex justify-center m-2"
    ></Calendar>
  );
}
