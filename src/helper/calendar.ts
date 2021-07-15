import addDays from "date-fns/addDays";
import differenceInDays from "date-fns/differenceInDays";
import lastDayOfMonth from "date-fns/lastDayOfMonth";
import lastDayOfWeek from "date-fns/lastDayOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import startOfWeek from "date-fns/startOfWeek";
import _format from "date-fns/format";
import _parse from "date-fns/parse";

// 配列を size ごとの chunk に分割する
const arrayChunk = <T extends any[]>([...array]: T, size = 1): T[] => {
  return array.reduce(
    (acc, _value, index) =>
      index % size ? acc : [...acc, array.slice(index, index + size)],
    []
  );
};

export const generateDateFromYM = (year: number, month: number) => {};

// date を含む月次カレンダーの日付の配列を作る
export const createMonthlyCalendarDates = (date: Date) => {
  const { startDate, endDate } = getCalendarPeriod(date);
  const diff = differenceInDays(endDate, startDate);

  const calendar = [...Array(diff + 1).keys()].map((n) =>
    addDays(startDate, n)
  );

  return calendar;
};

export const getCalendarPeriod = (date: Date) => {
  const first = startOfMonth(date);
  const last = lastDayOfMonth(date);
  const startDateOfWeek = startOfWeek(first);
  const lastDateOfWeek = lastDayOfWeek(last);

  return {
    startDate: startDateOfWeek,
    endDate: lastDateOfWeek,
  };
};

// 配列を７日ごとに分割して二次元配列して返す
export const generateMonthlyCalendar = (dates: Date[]) => {
  const calendar = arrayChunk(dates, 7);
  return calendar;
};

export const format = (date: Date) => _format(date, "yyyy-MM-dd");

export const parse = (date: string) => _parse(date, "yyyy-MM-dd", new Date());
