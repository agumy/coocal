import { setDay } from "date-fns";
import React, { useEffect } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useQuery } from "react-query";
import { useUserContext } from "../context/UserContext";
import { firestore } from "../firebase";
import { useMonthlyCalendar } from "../hooks/useMonthlyCalendar";
import { EventRegister } from "./EventRegister";

const PopoverComponent = React.forwardRef((props: any, ref) => {
  return (
    <Popover
      ref={ref}
      id="popover-basic"
      {...props}
      style={{ ...props.style, maxWidth: "400px" }}
      className="shadow-md bg-blue-100 w-full"
    >
      <Popover.Content className="h-full w-full">
        <EventRegister date={props.date} />
      </Popover.Content>
    </Popover>
  );
});

export const Calendar = () => {
  const [monthCalendar, days] = useMonthlyCalendar();
  const user = useUserContext();

  const { data } = useQuery(`menus`, () =>
    firestore
      .collection("menus")
      .where("author", "==", user?.uid)
      .orderBy("date", "asc")
      .startAt(days[0])
      .endAt(days[days.length - 1])
      .get()
      .then((res) => res.docs.map((d) => d.data()))
  );

  console.log(data);

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
                overlay={<PopoverComponent date={date} />}
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
