import { useCallback, useMemo, useState } from "react";
import {
  createMonthlyCalendarDates,
  generateMonthlyCalendar,
} from "../helper/calendar";

export const useMonthlyCalendar = (initialDate: Date) => {
  const [date, _setDate] = useState(initialDate);

  const setDate = useCallback((year: number, month: number) => {
    _setDate(new Date(year, month - 1));
  }, []);

  const calendar = useMemo(() => {
    const calendarDates = createMonthlyCalendarDates(date);
    const calendar = generateMonthlyCalendar(calendarDates);
    return calendar;
  }, [date]);

  return [calendar, date, setDate] as const;
};
