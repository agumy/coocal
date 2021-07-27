import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import { SignUp as DesktopSignUp } from "../../components/desktop/pages/sign-up";
import { SignUp as MobileSignUp } from "../../components/mobile/pages/SignUp";

type Props = {
  ua: string;
};
const SignUp: NextPage<Props> = ({ ua }) => {
  const device = useUserAgent(ua);

  return device.isDesktop ? <DesktopSignUp /> : <MobileSignUp />;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const ua = req.headers["user-agent"];

  return {
    props: {
      ua,
    },
  };
};

export default SignUp;
