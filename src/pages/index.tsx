import { NextPage } from "next";
import { Calendar } from "../components/Calendar";
import { isBrowser } from "react-device-detect";
import { MobileHome } from "../components/MobileHome";

const Home: NextPage = () => {
  return (
    <>
      {isBrowser ? (
        <div className="h-full w-full flex flex-col">
          <Calendar />
        </div>
      ) : (
        <div>
          <MobileHome />
        </div>
      )}
    </>
  );
};

export default Home;
