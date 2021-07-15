import { useCallback, useMemo } from "react";
import Link from "next/link";
import { Button, Spin } from "antd";
import classNames from "classnames";
import subMonths from "date-fns/subMonths";
import addMonths from "date-fns/addMonths";
import isSameDay from "date-fns/isSameDay";
import { groupBy } from "lodash";

import { useMonthlyCalendar } from "../../../../hooks/useMonthlyCalendar";
import { useMonthlyMenus } from "../../../../hooks/useMonthlyMenus";
import { format } from "../../../../helper/calendar";
import { useUserContext } from "../../../../context/UserContext";

const Weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MobileHome = () => {
  const { isLoading: isLoadingUser } = useUserContext();
  const [monthlyCalendar, calenderDate, setCalendarDate] = useMonthlyCalendar(
    new Date()
  );

  const { data, isLoading } = useMonthlyMenus(calenderDate);

  const menus = useMemo(() => {
    if (data) {
      const dic = groupBy(data ?? [], (menu) => menu.date);
      return dic;
    }
  }, [data]);

  const nextMonth = useCallback(() => {
    setCalendarDate((date) => addMonths(date, 1));
  }, []);

  const prevMonth = useCallback(() => {
    setCalendarDate((date) => subMonths(date, 1));
  }, []);

  const today = useCallback(() => {
    setCalendarDate(new Date());
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="w-full h-24 sticky top-0 border-b bg-white flex flex-col">
        <div className="h-4/6 flex justify-between px-3">
          <div className="h-full flex items-center gap-3">
            <button onClick={prevMonth}>←</button>
            <span>
              {new Intl.DateTimeFormat("ja", {
                year: "numeric",
                month: "2-digit",
              }).format(calenderDate)}
            </span>
            <button onClick={nextMonth}>→</button>
          </div>
          <div className="flex items-center">
            <Button type="default" onClick={today}>
              Today
            </Button>
          </div>
        </div>
        <div className="h-2/6 flex">
          {[...Array(7).keys()].map((n) => (
            <div
              key={n}
              className={classNames("w-1/7 flex justify-center", {
                "text-red-400": n === 0,
                "text-blue-400": n === 6,
              })}
            >
              {Weekday[n]}
            </div>
          ))}
        </div>
      </header>
      <main className="flex h-full w-full flex-wrap">
        {isLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <Spin tip="Loading..." />
          </div>
        ) : (
          monthlyCalendar.map((weekly, weeklyIndex) =>
            weekly.map((date) => (
              <Link
                key={date.toISOString()}
                href={`/menus?date=${format(date)}`}
              >
                <div
                  className={classNames("w-1/7 flex flex-col", {
                    "border-r": date.getDay() !== 6,
                    "border-b": weeklyIndex !== monthlyCalendar.length - 1,
                    [`h-1/${monthlyCalendar.length}`]: true,
                  })}
                >
                  <div
                    className={classNames(
                      "flex justify-center items-center py-1",
                      {
                        "font-bold":
                          date.getMonth() === calenderDate.getMonth(),
                        "text-gray-400 opacity-80":
                          date.getMonth() !== calenderDate.getMonth(),
                      }
                    )}
                  >
                    <div
                      className={classNames("inline-block", {
                        "rounded-full bg-blue-600 px-2 text-white font-light":
                          isSameDay(date, new Date()),
                      })}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                  <div className="flex items-start justify-center">
                    {menus && menus[format(date)] && <div>🍚</div>}
                  </div>
                </div>
              </Link>
            ))
          )
        )}
      </main>
    </div>
  );
};
