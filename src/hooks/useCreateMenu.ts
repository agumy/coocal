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
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<MonthlyMenus | undefined>(
        [start, end],
        (oldData) => {
          const key = format(date);
          if (!oldData) {
            return;
          }
          return {
            ...oldData,
            [key]: [...(oldData[key] ?? []), data],
          } as MonthlyMenus;
        }
      );

      document.body.click();
    },
  });

  return mutation;
};
