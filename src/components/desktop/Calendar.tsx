import React, { useMemo } from "react";
import groupBy from "lodash/groupBy";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { BsFillPlusCircleFill } from "react-icons/bs";
import format from "date-fns/format";
import setDay from "date-fns/setDay";

import { MenuDetail } from "./MenuDetail";
import { useMonthlyMenus } from "../../hooks/useMonthlyMenus";
import { useMonthlyCalendar } from "../../hooks/useMonthlyCalendar";

const PopoverComponent = React.forwardRef(function PopoverMenuDetail(
  { date, menu, calendarDate, ...props }: any,
  ref
) {
  return (
    <Popover
      ref={ref}
      id="popover-basic"
      {...props}
      style={{ ...props.style, maxWidth: "400px" }}
      className="shadow-md bg-blue-100 w-full"
    >
      <Popover.Content className="h-full w-full">
        <MenuDetail date={date} menu={menu} calendarDate={calendarDate} />
      </Popover.Content>
    </Popover>
  );
});

export const Calendar = () => {
  const [monthCalendar, calendarDate, setDate] = useMonthlyCalendar(new Date());

  const { data } = useMonthlyMenus(calendarDate);

  const menus = useMemo(() => {
    if (data) {
      const dic = groupBy(data ?? [], (menu) => menu.date);
      return dic;
    }
  }, [data]);

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
                    overlay={
                      <PopoverComponent
                        date={date}
                        calendarDate={calendarDate}
                      />
                    }
                  >
                    <BsFillPlusCircleFill className="absolute right-0 cursor-pointer" />
                  </OverlayTrigger>
                </span>
                {menus && (
                  <ul className="p-0 m-0 flex flex-col">
                    {menus[format(date, "yyyy-MM-dd")]?.map((menu, i) => (
                      <OverlayTrigger
                        key={i}
                        rootClose
                        trigger="click"
                        placement="auto-start"
                        overlay={
                          <PopoverComponent
                            date={date}
                            menu={menu}
                            calendarDate={calendarDate}
                          />
                        }
                      >
                        <li className="whitespace-nowrap overflow-ellipsis overflow-hidden text-bold text-black p-1 cursor-pointer">
                          {menu.name || "(タイトルなし)"}
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
