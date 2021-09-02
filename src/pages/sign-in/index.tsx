import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import { useMemo } from "react";
import { SignIn as DesktopSignIn } from "../../components/desktop/pages/SignIn";
import { SignIn as MobileSignIn } from "../../components/mobile/pages/SignIn";

type Props = {
  ua: string;
};
const SignIn: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    // eslint-disable-next-line
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  return device.isMobile ? <MobileSignIn /> : <DesktopSignIn />;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const ua = req.headers["user-agent"];

  return {
    props: {
      ua,
    },
  };
};

export default SignIn;
