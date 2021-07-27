import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import { MobileContainer } from "../../components/mobile/containers/MobileContainer";
import { SignUp as DesktopSignUp } from "../../components/desktop/pages/sign-up";

type Props = {
  ua: string;
};
const SignUp: NextPage<Props> = ({ ua }) => {
  const device = useUserAgent(ua);

  return device.isDesktop ? (
    <DesktopSignUp />
  ) : (
    <MobileContainer>
      <div className="h-full w-full">TEST</div>
    </MobileContainer>
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

export default SignUp;
