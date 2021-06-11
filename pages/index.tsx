import { NextPage } from "next";
import { useCallback } from "react";
import { Calendar } from "../components/Calendar";
import { firestore } from "../firebase";

const Home: NextPage = () => {
  const addUser = useCallback(() => {
    firestore.collection("users").add({
      name: "agumy",
    });
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <header className="h-32 w-full bg-blue-200 flex items-center justify-end px-4">
        <button
          onClick={addUser}
          className="border border-gray-500 rounded py-1 px-2 text-gray-500"
        >
          登録
        </button>
      </header>
      <div className="h-full w-full bg-blue-100">
        <Calendar />
      </div>
    </div>
  );
};

export default Home;
