import "bootstrap/dist/css/bootstrap.min.css";
import { setDay } from "date-fns";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useMonthlyCalendar } from "../hooks/useMonthlyCalendar";
import { EventRegister } from "./EventRegister";

const PopoverComponent = (props: any) => {
  return (
    <Popover
      id="popover-basic"
      {...props}
      className="shadow-md bg-blue-100 w-full"
    >
      <Popover.Content className="h-full w-full">
        <EventRegister />
      </Popover.Content>
    </Popover>
  );
};

export const Calendar = () => {
  const monthCalendar = useMonthlyCalendar();

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
              <OverlayTrigger
                rootClose
                trigger="click"
                placement="auto-start"
                overlay={PopoverComponent}
                key={date.toISOString()}
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-start justify-center w-1/7 p-1 h-full text-gray-500 border-gray-300 border-l border-b last:border-r"
                >
                  {date.toLocaleDateString("en-US", {
                    day: "numeric",
                  })}
                </div>
              </OverlayTrigger>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
