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

  const [days, setDays] = useState(3);
  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <MobileContainer>
          <main className="h-full w-full flex flex-col">
            <div className="flex flex-col h-full w-full gap-3 py-3 px-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={days}
                  className="border-gray-400 border py-1 px-2 text-right w-16"
                />
                <span className="text-lg">日分</span>
              </div>
              <div className="gap-4"></div>
            </div>
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

export default Menus;
