import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import parse from "date-fns/parse";
import { useRouter } from "next/dist/client/router";
import { useMemo } from "react";
import { useMonthlyMenus } from "../../hooks/useMonthlyMenus";
import { Spin } from "antd";
import { useMonthlyCalendar } from "../../hooks/useMonthlyCalendar";
import isSameDay from "date-fns/isSameDay";
import addWeeks from "date-fns/addWeeks";
import subWeeks from "date-fns/subWeeks";
import { useCallback } from "react";
import { useState } from "react";

type Props = {
  ua: string;
};

const Menu: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  const router = useRouter();

  const targetDateString = useMemo(() => {
    if (typeof router.query.date === "string") {
      return router.query.date;
    }
    return "";
  }, []);

  const id = useMemo(() => {
    if (typeof router.query.id === "string") {
      return router.query.id;
    }
    return "";
  }, []);

  const [targetDate, setTargetDate] = useState(
    parse(targetDateString, "yyyy-MM-dd", new Date())
  );

  const { data, isLoading } = useMonthlyMenus(targetDate);

  const menu = useMemo(() => {
    if (data) {
      return data.find((menu) => menu.id === id);
    }
  }, [data]);

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
          <main className="h-full w-full flex flex-col overflow-auto">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Spin tip="loading..." />
              </div>
            ) : (
              menu && (
                <div className="w-full flex flex-col justify-center items-start p-3">
                  <h1 className="text-xl">{menu.name}</h1>
                  <table className="border w-full">
                    <thead className="w-full border-b">
                      <th className="border-r w-5/7 pl-2">材料名</th>
                      <th className="w-2/7 pl-2">数量</th>
                    </thead>
                    <tbody>
                      {menu.ingredientList.map((ingredient) => (
                        <tr className="border-b last:border-b-0">
                          <td className="border-r pl-2">{ingredient.name}</td>
                          <td className="pl-2">{ingredient.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
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

export default Menu;
