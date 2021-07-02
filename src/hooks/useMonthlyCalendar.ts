import { useCallback, useMemo, useState } from "react";
import {
  createMonthlyCalendarDates,
  generateMonthlyCalendar,
} from "../helper/calendar";

export const useMonthlyCalendar = (initialDate: Date) => {
  const [date, setDate] = useState(initialDate);

  const calendar = useMemo(() => {
    const calendarDates = createMonthlyCalendarDates(date);
    const calendar = generateMonthlyCalendar(calendarDates);
    return calendar;
  }, [date]);

  return [calendar, date, setDate] as const;
};
