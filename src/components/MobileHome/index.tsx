import { useMonthlyCalendar } from "../../hooks/useMonthlyCalendar";

export const MobileHome = () => {
  const [monthlyCalendar] = useMonthlyCalendar(new Date());
  return (
    <div className="w-full h-full flex flex-col">
      <header className="w-full h-24 sticky top-0 border bg-white"></header>
      <main className="flex h-full w-full flex-wrap">
        {monthlyCalendar.map((weekly) =>
          weekly.map((date) => (
            <div className="w-1/7 flex justify-center pt-2">
              {date.getDate()}
            </div>
          ))
        )}
      </main>
    </div>
  );
};
