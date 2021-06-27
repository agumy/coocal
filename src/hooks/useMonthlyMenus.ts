import { useMemo } from "react";
import { useQuery } from "react-query";
import { useUserContext } from "../context/UserContext";
import MenuRepository from "../repository/MenuRepository";
import { createMonthlyCalendarDates, format } from "../helper/calendar";

export const useMonthlyMenus = (date: Date) => {
  const { user } = useUserContext();

  const calendarDates = createMonthlyCalendarDates(date);

  const { startDate, endDate } = useMemo(
    () => ({
      startDate: format(calendarDates[0]),
      endDate: format(calendarDates[calendarDates.length - 1]),
    }),
    [calendarDates]
  );

  const query = useQuery(
    [startDate, endDate],
    () => MenuRepository.get({ startDate, endDate }),
    { refetchOnWindowFocus: false, retry: false, enabled: !!user?.uid }
  );

  return query;
};
