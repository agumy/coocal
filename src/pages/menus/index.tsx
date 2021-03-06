import { useMemo, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useUserAgent } from "next-useragent";
import parse from "date-fns/parse";
import { useRouter } from "next/dist/client/router";
import { Spin, Result } from "antd";

import { WeekNavigator } from "../../components/mobile/organisms/WeekNavigator";
import { format } from "../../helper/calendar";
import { useMonthlyMenus } from "../../hooks/useMonthlyMenus";
import { MobileContainer } from "../../components/mobile/containers/MobileContainer";
import { AddMenuButton } from "../../components/mobile/organisms/AddMenuButton";

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
        <MobileContainer>
          <>
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
                  <Result title="????????????????????????????????????" />
                )}
              </div>
            </main>
            <AddMenuButton href={`/menu/new?date=${format(targetDate)}`} />
          </>
        </MobileContainer>
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
