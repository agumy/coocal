import { useState, useMemo } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import parse from "date-fns/parse";
import { useRouter } from "next/dist/client/router";
import { useMonthlyMenus } from "../../hooks/useMonthlyMenus";
import { Spin } from "antd";
import { useUpdateMenu } from "../../hooks/useUpdateMenu";
import { format } from "../../helper/calendar";
import { MobileContainer } from "../../components/mobile/containers/MobileContainer";
import { WeekNavigator } from "../../components/mobile/organisms/WeekNavigator";
import { MenuForm } from "../../components/mobile/organisms/MenuForm";

type Props = {
  ua: string;
};

const Menu: NextPage<Props> = ({ ua }) => {
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
  }, [router.query.date]);

  const id = useMemo(() => {
    if (typeof router.query.id === "string") {
      return router.query.id;
    }
    return "";
  }, [router.query.id]);

  const [targetDate] = useState(
    parse(targetDateString, "yyyy-MM-dd", new Date())
  );

  const { data, isLoading } = useMonthlyMenus(targetDate);

  const menu = useMemo(() => {
    if (data) {
      return data.find((menu) => menu.id === id);
    }
  }, [data, id]);
  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <MobileContainer
          hrefTitle="一覧"
          href={`/menus?date=${format(targetDate)}`}
        >
          <main className="h-full w-full flex flex-col overflow-auto">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Spin tip="loading..." />
              </div>
            ) : (
              menu && (
                <div className="flex flex-col h-full">
                  <WeekNavigator
                    value={targetDate}
                    onSelect={(date) => {
                      router.push(`/menus?date=${format(date)}`);
                    }}
                  />
                  <main className="h-full w-full flex flex-col overflow-auto">
                    <MenuForm menu={menu} date={targetDate} />
                  </main>
                </div>
              )
            )}
          </main>
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

export default Menu;
