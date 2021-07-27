import { NextPage, GetServerSideProps } from "next";
import { MobileHome } from "../components/mobile/pages/Home";
import { Home as DesktopHome } from "../components/desktop/pages/Home";
import { useUserAgent } from "next-useragent";

type Props = {
  ua: string;
};

const Home: NextPage<Props> = ({ ua }) => {
  const device = useUserAgent(global.navigator?.userAgent ?? ua);

  return device.isDesktop ? <DesktopHome /> : <MobileHome />;
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
