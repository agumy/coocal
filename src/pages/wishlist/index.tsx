import { NextPage } from "next";
import { MobileContainer } from "../../components/mobile/containers/MobileContainer";
import { AddMenuButton } from "../../components/mobile/organisms/AddMenuButton";
const Wishlist: NextPage = () => {
  return (
    <MobileContainer>
      <main className="h-full w-full"></main>
      <AddMenuButton />
    </MobileContainer>
  );
};

export default Wishlist;
