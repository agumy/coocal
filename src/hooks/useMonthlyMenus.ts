import { useMemo } from "react";
import groupBy from "lodash/groupBy";
import { useQuery } from "react-query";
import { useUserContext } from "../context/UserContext";
import MenuRepository from "../repository/MenuRepository";
import { createMonthlyCalendarDates, format } from "../helper/calendar";
import { Dictionary } from "lodash";
import { Menu } from "../models/Menu";

export type MonthlyMenus = Dictionary<Menu[]>;

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

  const query = useQuery<MonthlyMenus>(
    [startDate, endDate],
    () => {
      return MenuRepository.get({ startDate, endDate }).then((res) => {
        const dic = groupBy(res.menus, (menu) => menu.date);
        return dic;
      });
    },
    { refetchOnWindowFocus: false, retry: false, enabled: !!user?.uid }
  );

  return query;
};
