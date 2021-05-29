import {
  addDays,
  differenceInDays,
  lastDayOfMonth,
  lastDayOfWeek,
  setDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const arrayChunk = <T extends any[]>([...array]: T, size = 1): T[] => {
  return array.reduce(
    (acc, value, index) =>
      index % size ? acc : [...acc, array.slice(index, index + size)],
    []
  );
};

export const Calendar = () => {
  const monthCalendar = (() => {
    const today = new Date();
    const first = startOfMonth(today);
    const last = lastDayOfMonth(today);
    const startDateOfWeek = startOfWeek(first);
    const lastDateOfWeek = lastDayOfWeek(last);
    const diff = differenceInDays(lastDateOfWeek, startDateOfWeek);

    const calendar = [...Array(diff + 1).keys()].map((n) =>
      addDays(startDateOfWeek, n)
    );

    return arrayChunk(calendar, 7);
  })();

  return (
    <div className="flex flex-col h-full w-full p-4">
      <div className="w-full h-7 flex">
        {[...Array(7).keys()].map((n) => (
          <div
            key={n}
            className="w-1/7 flex items-center justify-center text-gray-400 border-gray-300 border border-r-0 border-b-0 last:border-r"
          >
            {setDay(new Date(), n).toLocaleDateString(
              global.navigator?.language,
              { weekday: "short" }
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col h-full w-full">
        {monthCalendar.map((weekCalendar, i) => (
          <div key={i} className="flex h-full w-full">
            {weekCalendar.map((date, j) => (
              <div
                tabIndex={0}
                role="button"
                key={date.toISOString()}
                className="flex items-start justify-center w-1/7 p-1 h-full text-gray-500 border-gray-300 border-l border-b last:border-r"
              >
                {date.toLocaleDateString("en-US", {
                  day: "numeric",
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
