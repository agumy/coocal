import { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createMonthlyCalendarDates, format } from "../helper/calendar";
import { Menu } from "../models/Menu";
import MenuRepository from "../repository/MenuRepository";

export const useUpdateMenu = (date: Date | null) => {
  const queryClient = useQueryClient();

  const keys = useMemo(() => {
    if (!date) {
      return [];
    }
    const calendarDates = createMonthlyCalendarDates(date);
    return [
      format(calendarDates[0]),
      format(calendarDates[calendarDates.length - 1]),
    ];
  }, [date]);

  const mutation = useMutation(MenuRepository.update, {
    onSuccess: (data) => {
      queryClient.setQueryData<Menu[] | undefined>(keys, (oldData) => {
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
