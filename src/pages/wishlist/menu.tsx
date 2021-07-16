import { useMemo } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import { useRouter } from "next/dist/client/router";
import { Spin } from "antd";
import { format } from "../../helper/calendar";
import { MobileContainer } from "../../components/mobile/containers/MobileContainer";
import { WeekNavigator } from "../../components/mobile/organisms/WeekNavigator";
import { WishMenuForm } from "../../components/mobile/organisms/WishMenuForm";
import { useWishlist } from "../../hooks/useWishlist";

type Props = {
  ua: string;
};

const Menu: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    // eslint-disable-next-line
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  const router = useRouter();

  const id = useMemo(() => {
    if (typeof router.query.id === "string") {
      return router.query.id;
    }
    return "";
  }, [router.query.id]);

  const { data, isLoading } = useWishlist();

  const menu = useMemo(() => {
    if (data) {
      return data.find((menu) => menu.id === id);
    }
  }, [data, id]);
  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <MobileContainer hrefTitle="一覧" href="/wishlist">
          <main className="h-full w-full flex flex-col overflow-auto">
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Spin tip="loading..." />
              </div>
            ) : (
              menu && (
                <div className="flex flex-col h-full">
                  <WeekNavigator
                    value={new Date()}
                    onSelect={(date) => {
                      router.push(`/menus?date=${format(date)}`);
                    }}
                  />
                  <main className="h-full w-full flex flex-col overflow-auto">
                    <WishMenuForm menu={menu} />
                  </main>
                </div>
              )
            )}
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

export default Menu;
