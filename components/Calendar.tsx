import React from "react";
import setDay from "date-fns/setDay";
import groupBy from "lodash/groupBy";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { BsFillPlusCircleFill } from "react-icons/bs";
import Popover from "react-bootstrap/Popover";
import { useQuery } from "react-query";
import { useUserContext } from "../context/UserContext";
import { firestore } from "../firebase";
import { useMonthlyCalendar } from "../hooks/useMonthlyCalendar";
import { EventRegister } from "./EventRegister";
import { getMonth, getYear } from "date-fns";
import { useMenus } from "../hooks/useMenus";

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
  const [monthCalendar] = useMonthlyCalendar(
    getYear(new Date()),
    getMonth(new Date())
  );

  const { data: menus } = useMenus(getYear(new Date()), getMonth(new Date()));

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
            {weekCalendar.map((date) => (
              <div
                key={date.toISOString()}
                tabIndex={0}
                className="flex flex-col w-1/7 p-1 h-full text-gray-500 border-gray-300 border-l border-b last:border-r"
              >
                <span className="flex items-center justify-center relative min-w-full">
                  {date.toLocaleDateString("en-US", {
                    day: "numeric",
                  })}
                  <OverlayTrigger
                    rootClose
                    trigger="click"
                    placement="auto-start"
                    overlay={<PopoverComponent date={date} />}
                  >
                    <BsFillPlusCircleFill className="absolute right-0 cursor-pointer" />
                  </OverlayTrigger>
                </span>
                {menus && (
                  <ul className="p-0 m-0 flex flex-col">
                    {menus[date.toISOString()]?.map((menu) => (
                      <OverlayTrigger
                        key={menu.name}
                        rootClose
                        trigger="click"
                        placement="auto-start"
                        overlay={<PopoverComponent date={date} menu={menu} />}
                      >
                        <li className="whitespace-nowrap overflow-ellipsis overflow-hidden text-bold text-black p-1 cursor-pointer">
                          {menu.name}
                        </li>
                      </OverlayTrigger>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
