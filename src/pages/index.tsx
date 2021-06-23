import { NextPage } from "next";
import { Calendar } from "../components/Calendar";

const Home: NextPage = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <Calendar />
    </div>
  );
};

export default Home;
