import { useMemo, useCallback, useState, useEffect } from "react";
import classNames from "classnames";
import isSameDay from "date-fns/isSameDay";
import addWeeks from "date-fns/addWeeks";
import subWeeks from "date-fns/subWeeks";

import { useMonthlyCalendar } from "../../../hooks/useMonthlyCalendar";

type Props = {
  value: Date;
  onSelect: (date: Date) => void;
};

const Weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const WeekNavigator = ({ value = new Date(), onSelect }: Props) => {
  const [calendar, , setCalendarDate] = useMonthlyCalendar(value);

  const [date, setDate] = useState(value);
  useEffect(() => {
    setDate(date);
  }, [value]);

  const nextWeek = useCallback(() => {
    setCalendarDate((date) => addWeeks(date, 1));
    setDate((date) => addWeeks(date, 1));
  }, []);

  const prevWeek = useCallback(() => {
    setCalendarDate((date) => subWeeks(date, 1));
    setDate((date) => subWeeks(date, 1));
  }, []);

  const weekly = useMemo(() => {
    return calendar.find((week) => week.some((d) => isSameDay(d, date)));
  }, [calendar, value]);

  return (
    <header className="flex flex-col w-full h-24 border-b">
      <div className="flex justify-between h-full items-center px-3">
        <button onClick={prevWeek}>←</button>
        <div className="font-bold text-lg">
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
          }).format(date)}
        </div>
        <button onClick={nextWeek}>→</button>
      </div>
      <div className="flex items-end h-full pb-1">
        {[...Array(7).keys()].map((n) => (
          <div
            key={n}
            className="w-1/7 flex flex-col justify-center items-center"
          >
            <div>{Weekday[n]}</div>
            {weekly && (
              <div
                role="button"
                onClick={() => onSelect(weekly[n])}
                className={classNames({
                  "rounded-full bg-blue-600 px-2 text-white font-light inline-block":
                    isSameDay(weekly[n], value),
                })}
              >
                {weekly[n]?.getDate()}
              </div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
};
