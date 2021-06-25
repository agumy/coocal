import { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createMonthlyCalendarDates, format } from "../helper/calendar";
import MenuRepository from "../repository/MenuRepository";
import { MonthlyMenus } from "./useMonthlyMenus";

export const useCreateMenu = (date: Date) => {
  const queryClient = useQueryClient();

  const calendarDates = useMemo(() => createMonthlyCalendarDates(date), [date]);

  const { start, end } = useMemo(
    () => ({
      start: format(calendarDates[0]),
      end: format(calendarDates[calendarDates.length - 1]),
    }),
    [calendarDates]
  );

  const mutation = useMutation(MenuRepository.create, {
    onSuccess: (data, { date }) => {
      queryClient.setQueryData<MonthlyMenus | undefined>(
        [start, end],
        (oldData) => {
          if (!oldData) {
            return;
          }
          return {
            ...oldData,
            [date]: [...(oldData[date] ?? []), data],
          } as MonthlyMenus;
        }
      );

      // FIXME: UIの責務
      document.body.click();
    },
  });

  return mutation;
};
