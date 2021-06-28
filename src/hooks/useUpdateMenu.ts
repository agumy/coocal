import { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createMonthlyCalendarDates, format } from "../helper/calendar";
import { Menu } from "../models/Menu";
import MenuRepository from "../repository/MenuRepository";

export const useUpdateMenu = (date: Date) => {
  const queryClient = useQueryClient();

  const calendarDates = useMemo(() => createMonthlyCalendarDates(date), [date]);

  const { start, end } = useMemo(
    () => ({
      start: format(calendarDates[0]),
      end: format(calendarDates[calendarDates.length - 1]),
    }),
    [calendarDates]
  );

  const mutation = useMutation(MenuRepository.update, {
    onSuccess: (data) => {
      queryClient.setQueryData<Menu[] | undefined>([start, end], (oldData) => {
        if (!oldData) {
          return;
        }
        return oldData.map((d) => (d.id === data.id ? data : d));
      });

      // FIXME: UIの責務
      document.body.click();
    },
  });

  return mutation;
};