import {
  addDays,
  differenceInDays,
  lastDayOfMonth,
  lastDayOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const arrayChunk = <T extends any[]>([...array]: T, size = 1): T[] => {
  return array.reduce(
    (acc, _value, index) =>
      index % size ? acc : [...acc, array.slice(index, index + size)],
    []
  );
};

export const useMonthlyCalendar = (year: number, month: number) => {
  const date = new Date(year, month);
  const first = startOfMonth(date);
  const last = lastDayOfMonth(date);
  const startDateOfWeek = startOfWeek(first);
  const lastDateOfWeek = lastDayOfWeek(last);
  const diff = differenceInDays(lastDateOfWeek, startDateOfWeek);

  const calendar = [...Array(diff + 1).keys()].map((n) =>
    addDays(startDateOfWeek, n)
  );

  return [arrayChunk(calendar, 7), calendar] as const;
};
