import { useMemo } from "react";
import groupBy from "lodash/groupBy";
import { useQuery } from "react-query";
import format from "date-fns/format";
import { useUserContext } from "../context/UserContext";
import MenuRepository from "../repository/MenuRepository";

export const useMenus = (period: { start: Date; end: Date }) => {
  const { user } = useUserContext();

  const { startDate, endDate } = useMemo(
    () => ({
      startDate: format(period.start, "yyyy-MM-dd"),
      endDate: format(period.end, "yyyy-MM-dd"),
    }),
    [period]
  );

  const query = useQuery(
    [startDate, endDate, user?.uid],
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
