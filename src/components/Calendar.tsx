import React, { useMemo } from "react";
import groupBy from "lodash/groupBy";
import setDay from "date-fns/setDay";
import format from "date-fns/format";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { BsFillPlusCircleFill } from "react-icons/bs";
import Popover from "react-bootstrap/Popover";
import getYear from "date-fns/getYear";
import getMonth from "date-fns/getMonth";
import { useMenus } from "../hooks/useMenus";
import { EventRegister } from "./EventRegister";
import { useMonthlyCalendar } from "../hooks/useMonthlyCalendar";
import { useQuery } from "react-query";
import MenuRepository from "../repository/MenuRepository";
import { useUserContext } from "../context/UserContext";
import { Dictionary } from "lodash";
import { Menu } from "../models/Menu";

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
        <EventRegister date={props.date} menu={props.menu} />
      </Popover.Content>
    </Popover>
  );
});

export const Calendar = () => {
  const [monthCalendar, dates] = useMonthlyCalendar(
    getYear(new Date()),
    getMonth(new Date())
  );

  const { user } = useUserContext();

  const { startDate, endDate } = useMemo(
    () => ({
      startDate: format(dates[0], "yyyy-MM-dd"),
      endDate: format(dates[dates.length - 1], "yyyy-MM-dd"),
    }),
    [dates]
  );

  const { data, isLoading } = useQuery(
    [startDate, endDate, user?.uid ?? ""],
    () => {
      if (!user) {
        return Promise.resolve({} as Dictionary<Menu[]>);
      }
      return MenuRepository.get({ startDate, endDate }).then((res) => {
        const dic = groupBy(res.menus, (menu) => menu.date);
        return dic;
      });
    },
    { refetchOnWindowFocus: false }
  );

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
                {data && (
                  <ul className="p-0 m-0 flex flex-col">
                    {data[format(date, "yyyy-MM-dd")]?.map((menu, i) => (
                      <OverlayTrigger
                        key={i}
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