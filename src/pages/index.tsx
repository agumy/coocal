import { NextPage, GetServerSideProps } from "next";
import { Calendar } from "../components/desktop/Calendar";
import { MobileHome } from "../components/mobile/pages/Home";
import { DesktopContainer } from "../components/desktop/DesktopContainer";
import { useUserAgent } from "next-useragent";
import { useMemo } from "react";
import { MobileContainer } from "../components/mobile/containers/MobileContainer";

type Props = {
  ua: string;
};

const Home: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    // eslint-disable-next-line
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
        <MobileContainer>
          <MobileHome />
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

export default Home;
