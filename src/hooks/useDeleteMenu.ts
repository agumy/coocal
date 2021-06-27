import { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createMonthlyCalendarDates, format } from "../helper/calendar";
import { Menu } from "../models/Menu";
import MenuRepository from "../repository/MenuRepository";

export const useDeleteMenu = (date: Date) => {
  const queryClient = useQueryClient();

  const calendarDates = useMemo(() => createMonthlyCalendarDates(date), [date]);

  const { start, end } = useMemo(
    () => ({
      start: format(calendarDates[0]),
      end: format(calendarDates[calendarDates.length - 1]),
    }),
    [calendarDates]
  );

  const mutation = useMutation(MenuRepository.delete, {
    onSuccess: (data) => {
      queryClient.setQueryData<Menu[] | undefined>([start, end], (oldData) => {
        if (!oldData) {
          return;
        }
        return oldData.filter((d) => d.id !== data.menu.id);
      });

      // FIXME: UIの責務
      document.body.click();
    },
  });

  return mutation;
};
