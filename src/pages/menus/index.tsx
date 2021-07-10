import { useMemo, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useUserAgent } from "next-useragent";
import parse from "date-fns/parse";
import { useRouter } from "next/dist/client/router";
import { Spin, Result } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";

import { WeekNavigator } from "../../components/mobile/organisms/WeekNavigator";
import { format } from "../../helper/calendar";
import { useMonthlyMenus } from "../../hooks/useMonthlyMenus";

type Props = {
  ua: string;
};

const Menus: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    // eslint-disable-next-line
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

  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <div className="flex flex-col h-full">
          <header className="h-16 border-b"></header>
          <main className="h-full w-full flex flex-col">
            <WeekNavigator value={targetDate} onSelect={setTargetDate} />
            <div className="h-full w-full overflow-auto">
              {!menus || isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Spin tip="loading..." />
                </div>
              ) : menus && menus.length ? (
                menus.map((menu) => (
                  <Link
                    key={menu.id}
                    href={`menu?date=${format(targetDate)}&id=${menu.id}`}
                  >
                    <div
                      className="w-full h-16 flex flex-col justify-center items-start border-b p-3"
                      key={menu.id}
                    >
                      <span className="font-bold">{menu.name}</span>
                      <span className="text-sm text-gray-400">
                        author: {menu.author}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <Result title="献立が登録されていません" />
              )}
            </div>
          </main>
          <div className="fixed bottom-0 right-0">
            <Link href={`/menu/new?date=${format(targetDate)}`}>
              <PlusCircleFilled className="text-6xl pr-4 pb-4" />
            </Link>
          </div>
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
