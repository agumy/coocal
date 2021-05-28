import { NextPage } from "next";
import { Calendar } from "../components/Calendar";

const Home: NextPage = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-32 w-full bg-blue-200" />
      <div className="h-full w-full bg-blue-100">
        <Calendar />
      </div>
    </div>
  );
};

export default Home;
