import { NextPage, GetServerSideProps } from "next";
import { useUserAgent } from "next-useragent";
import parse from "date-fns/parse";
import { useRouter } from "next/dist/client/router";
import { useMemo, useState } from "react";
import { format } from "../../helper/calendar";
import { WeekNavigator } from "../../components/mobile/organisms/WeekNavigator";
import { MenuForm } from "../../components/mobile/organisms/MenuForm";
import { MobileContainer } from "../../components/mobile/containers/MobileContainer";

type Props = {
  ua: string;
};

const New: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    // eslint-disable-next-line
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  const router = useRouter();

  const targetDateString = useMemo(() => {
    if (typeof router.query.date === "string") {
      return router.query.date;
    }
    return format(new Date());
  }, [router.query.date]);

  const [targetDate, setTargetDate] = useState(
    parse(targetDateString, "yyyy-MM-dd", new Date())
  );

  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <MobileContainer
          hrefTitle="一覧"
          href={targetDate ? `/menus?date=${format(targetDate)}` : "/wishlist"}
        >
          <main className="h-full w-full flex flex-col overflow-auto">
            <WeekNavigator
              value={targetDate ?? new Date()}
              onSelect={(date) => setTargetDate(date)}
            />
            <MenuForm date={targetDate} />
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

export default New;
