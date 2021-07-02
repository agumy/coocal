import { useMonthlyCalendar } from "../../hooks/useMonthlyCalendar";
import classNames from "classnames";

const Weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MobileHome = () => {
  const [monthlyCalendar, calenderDate] = useMonthlyCalendar(new Date());
  return (
    <div className="w-full h-full flex flex-col">
      <header className="w-full h-24 sticky top-0 border-b bg-white flex flex-col">
        <div className="h-4/6 flex items-center p-2">
          <span>
            {new Intl.DateTimeFormat("ja", {
              year: "numeric",
              month: "2-digit",
            }).format(calenderDate)}
          </span>
        </div>
        <div className="h-2/6 flex">
          {[...Array(7).keys()].map((n) => (
            <div
              className={classNames("w-1/7 flex justify-center", {
                "text-red-400": n === 0,
                "text-blue-400": n === 6,
              })}
            >
              {Weekday[n]}
            </div>
          ))}
        </div>
      </header>
      <main className="flex h-full w-full flex-wrap">
        {monthlyCalendar.map((weekly) =>
          weekly.map((date) => (
            <div
              className={classNames("w-1/7 flex flex-col border-b", {
                "border-r": date.getDay() !== 6,
              })}
            >
              <div
                className={classNames("pt-1 pl-2", {
                  "font-bold": date.getMonth() === calenderDate.getMonth(),
                  "text-gray-400 opacity-80":
                    date.getMonth() !== calenderDate.getMonth(),
                })}
              >
                {date.getDate()}
              </div>
              <div></div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
