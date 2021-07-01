import { NextPage, GetServerSideProps } from "next";
import { Calendar } from "../components/Calendar";
import { MobileHome } from "../components/MobileHome";
import { DesktopContainer } from "../components/DesktopContainer";
import { useUserAgent } from "next-useragent";
import { useMemo } from "react";

type Props = {
  ua: string;
};

const Home: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  return (
    <>
      {!device.isMobile ? (
        <DesktopContainer>
          <div className="h-full w-full flex flex-col">
            <Calendar />
          </div>
        </DesktopContainer>
      ) : (
        <div className="flex flex-col h-full">
          <header className="h-16 border-b"></header>
          <MobileHome />
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

export default Home;
