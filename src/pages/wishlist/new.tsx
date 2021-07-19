import { NextPage, GetServerSideProps } from "next";
import { useUserAgent } from "next-useragent";
import { useMemo } from "react";
import { WishMenuForm } from "../../components/mobile/organisms/WishMenuForm";
import { MobileContainer } from "../../components/mobile/containers/MobileContainer";

type Props = {
  ua: string;
};

const New: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    // eslint-disable-next-line
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <MobileContainer hrefTitle="一覧" href="/wishlist">
          <main className="w-full flex flex-col overflow-auto">
            <WishMenuForm />
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
