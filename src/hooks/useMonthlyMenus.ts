import { useMemo } from "react";
import { useQuery } from "react-query";
import { useUserContext } from "../context/UserContext";
import MenuRepository from "../repository/MenuRepository";
import { getCalendarPeriod, format } from "../helper/calendar";

export const useMonthlyMenus = (date: Date) => {
  const { user } = useUserContext();

  const period = getCalendarPeriod(date);

  const { startDate, endDate } = useMemo(
    () => ({
      startDate: format(period.startDate),
      endDate: format(period.endDate),
    }),
    [period]
  );

  const query = useQuery(
    [startDate, endDate],
    () => MenuRepository.get({ startDate, endDate }),
    { refetchOnWindowFocus: false, retry: false, enabled: !!user?.uid }
  );

  return query;
};
