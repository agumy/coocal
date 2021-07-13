import { NextPage } from "next";
import { Result } from "antd";

import { MobileContainer } from "../../components/mobile/containers/MobileContainer";
import { AddMenuButton } from "../../components/mobile/organisms/AddMenuButton";
import { useWishlist } from "../../hooks/useWishlist";

const Wishlist: NextPage = () => {
  const { data } = useWishlist();

  return (
    <MobileContainer>
      <main className="h-full w-full">
        {data ? (
          data.map((e) => (
            <div
              className="w-full h-16 flex flex-col justify-center items-start border-b p-3"
              key={e.id}
            >
              <span className="font-bold">{e.name}</span>
              <span className="text-sm text-gray-400">
                {/* author: {menu.author} */}
              </span>
            </div>
          ))
        ) : (
          <Result title="献立が登録されていません" />
        )}
      </main>
      <AddMenuButton />
    </MobileContainer>
  );
};

export default Wishlist;
