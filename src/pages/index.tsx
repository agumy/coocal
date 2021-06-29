import { NextPage } from "next";
import { Calendar } from "../components/Calendar";
import { isBrowser } from "react-device-detect";
import { MobileHome } from "../components/MobileHome";
import { DesktopContainer } from "../components/DesktopContainer";

const Home: NextPage = () => {
  return (
    <>
      {isBrowser ? (
        <DesktopContainer>
          <div className="h-full w-full flex flex-col">
            <Calendar />
          </div>
        </DesktopContainer>
      ) : (
        <div>
          <MobileHome />
        </div>
      )}
    </>
  );
};

export default Home;
