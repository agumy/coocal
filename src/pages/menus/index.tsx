import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import parse from "date-fns/parse";
import { useRouter } from "next/dist/client/router";
import { useMemo } from "react";
import { useMonthlyMenus } from "../../hooks/useMonthlyMenus";
import { Spin } from "antd";
import classNames from "classnames";
import { useMonthlyCalendar } from "../../hooks/useMonthlyCalendar";
import isSameDay from "date-fns/isSameDay";
import addWeeks from "date-fns/addWeeks";
import subWeeks from "date-fns/subWeeks";
import { useCallback } from "react";
import { useState } from "react";
import { format } from "../../helper/calendar";

type Props = {
  ua: string;
};

const Weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Menus: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  const router = useRouter();
  const targetDateString = useMemo(() => {
    if (typeof router.query.date === "string") {
      return router.query.date;
    }
    return "";
  }, [router]);

  const [targetDate, setTargetDate] = useState(
    parse(targetDateString, "yyyy-MM-dd", new Date())
  );

  const { data, isLoading } = useMonthlyMenus(targetDate);

  const menus = useMemo(() => {
    if (data) {
      return data.filter((menu) => menu.date === format(targetDate));
    }
  }, [data, targetDate]);

  const [calendar, , setCalendarDate] = useMonthlyCalendar(targetDate);

  const nextWeek = useCallback(() => {
    setCalendarDate((date) => addWeeks(date, 1));
    setTargetDate((date) => addWeeks(date, 1));
  }, []);

  const prevWeek = useCallback(() => {
    setCalendarDate((date) => subWeeks(date, 1));
    setTargetDate((date) => subWeeks(date, 1));
  }, []);

  const weekly = useMemo(() => {
    return calendar.find((week) =>
      week.some((date) => isSameDay(date, targetDate))
    );
  }, [calendar, targetDate]);

  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <div className="flex flex-col h-full">
          <header className="h-16 border-b"></header>
          <main className="h-full w-full flex flex-col">
            <header className="flex flex-col w-full h-24 border-b">
              <div className="flex justify-between h-full items-center px-3">
                <button onClick={prevWeek}>←</button>
                <div className="font-bold text-lg">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                  }).format(targetDate)}
                </div>
                <button onClick={nextWeek}>→</button>
              </div>
              <div className="flex items-end h-full pb-1">
                {[...Array(7).keys()].map((n) => (
                  <div className="w-1/7 flex flex-col justify-center items-center">
                    <div>{Weekday[n]}</div>
                    {weekly && (
                      <div
                        role="button"
                        onClick={() => setTargetDate(weekly[n])}
                        className={classNames({
                          "text-blue-400":
                            weekly[n]?.getDate() === targetDate.getDate(),
                        })}
                      >
                        {weekly[n]?.getDate()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </header>
            <div className="h-full w-full overflow-auto">
              {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Spin tip="loading..." />
                </div>
              ) : (
                menus?.map((menu) => (
                  <div
                    className="w-full h-16 flex flex-col justify-center items-start border-b p-3"
                    key={menu.id}
                  >
                    <span className="font-bold">{menu.name}</span>
                    <span className="text-sm text-gray-400">
                      author: {menu.author}
                    </span>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const ua = req.headers["user-agent"];

  return {
    props: {
      ua,
    },
  };
};

export default Menus;
