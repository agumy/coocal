import setDay from "date-fns/setDay";

export const Calendar = () => {
  return (
    <div className="flex flex-col h-full w-full p-4">
      <div className="w-full h-7 flex">
        {[...Array(7).keys()].map((n) => (
          <div className="w-1/7 flex items-center justify-center font-bold border-gray-300 border border-r-0 border-b-0 last:border-r">
            {setDay(new Date(), n).toLocaleDateString(
              global.navigator?.language,
              { weekday: "short" }
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col h-full w-full">
        {[...Array(5).keys()].map(() => (
          <div className="flex h-full w-full">
            {[...Array(7).keys()].map(() => (
              <div className="w-1/7 h-full border-gray-300 border-l border-b last:border-r" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
