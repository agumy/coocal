import { NextPage } from "next";
import { Result } from "antd";

import { MobileContainer } from "../../components/mobile/containers/MobileContainer";
import { AddMenuButton } from "../../components/mobile/organisms/AddMenuButton";

const useWishList = () => {
  return [{ id: "1" }];
};
const Wishlist: NextPage = () => {
  const wishList = useWishList();

  return (
    <MobileContainer>
      <main className="h-full w-full">
        {wishList.length ? (
          wishList.map((e) => (
            <div
              className="w-full h-16 flex flex-col justify-center items-start border-b p-3"
              key={e.id}
            >
              <span className="font-bold">test</span>
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
