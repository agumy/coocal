import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import parse from "date-fns/parse";
import { useRouter } from "next/dist/client/router";
import { useMemo } from "react";
import { useMonthlyMenus } from "../../hooks/useMonthlyMenus";
import { Spin } from "antd";

type Props = {
  ua: string;
};

const Menus: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  const router = useRouter();
  const targetDate = useMemo(() => {
    if (typeof router.query.date === "string") {
      return router.query.date;
    }
    return "";
  }, [router]);

  const { data, isLoading } = useMonthlyMenus(
    parse(targetDate, "yyyy-MM-dd", new Date())
  );

  const menus = useMemo(() => {
    if (data) {
      return data.filter((menu) => menu.date === targetDate);
    }
  }, [data]);

  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <div className="flex flex-col h-full">
          <header className="h-16 border-b"></header>
          <div className="h-full w-full">
            {isLoading ? (
              <Spin />
            ) : (
              menus?.map((menu) => <div>{menu.name}</div>)
            )}
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
