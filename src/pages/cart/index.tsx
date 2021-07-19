import React, { SyntheticEvent, useCallback, useMemo, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import { addDays } from "date-fns";
import { useEffect } from "react";
import { groupBy } from "lodash";
import { Spin } from "antd";

import { MobileContainer } from "../../components/mobile/containers/MobileContainer";
import { useQuery } from "react-query";
import MenuRepository from "../../repository/MenuRepository";
import { format } from "../../helper/calendar";

type Props = {
  ua: string;
};

const Menus: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    // eslint-disable-next-line
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  const [days, setDays] = useState(3);

  const blur = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
    setDays(Number(e.currentTarget.value));
  }, []);

  const { data, isLoading, refetch } = useQuery(
    [format(new Date()), format(addDays(new Date(), days - 1))],
    () =>
      MenuRepository.get({
        startDate: format(new Date()),
        endDate: format(addDays(new Date(), days - 1)),
      }),
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const menus = useMemo(() => {
    const dic = groupBy(data ?? [], (menu) => menu.date);
    return dic;
  }, [data]);

  useEffect(() => {
    refetch();
  }, [days]);

  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <MobileContainer>
          <main className="w-full flex flex-col overflow-y-auto">
            <div className="flex flex-col w-full gap-3 py-3 px-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={days}
                  onBlur={blur}
                  className="border-gray-400 border py-1 px-2 text-right w-16"
                />
                <span className="text-lg">日分</span>
              </div>
              <div className="flex flex-col gap-2">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Spin tip="Loading..." />
                  </div>
                ) : (
                  Object.keys(menus).map((date) => (
                    <div key={date} className="rounded flex flex-col gap-2">
                      <span className="text-sm text-black">{date}</span>
                      {menus[date].map((menu) => (
                        <div
                          key={menu.id}
                          className="flex flex-col p-2 gap-1 border border-gray-400 rounded shadow-md"
                        >
                          <span className="text-lg text-black font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {menu.name}
                          </span>
                          <ul className="flex flex-col gap-1 pl-5 pr-1 text-xs mb-0">
                            {menu.ingredientList.map((ingredient, i) => (
                              <li
                                key={i}
                                className="flex justify-between items-center"
                              >
                                <span>{ingredient.name}</span>
                                <span>{ingredient.amount}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </MobileContainer>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const ua = req.headers["user-agent"];

  return {
    props: {
      ua,
    },
  };
};

export default Menus;
