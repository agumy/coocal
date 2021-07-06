import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import parse from "date-fns/parse";
import { useRouter } from "next/dist/client/router";
import { useMemo } from "react";
import { useMonthlyCalendar } from "../../hooks/useMonthlyCalendar";
import isSameDay from "date-fns/isSameDay";
import addWeeks from "date-fns/addWeeks";
import subWeeks from "date-fns/subWeeks";
import { useCallback } from "react";
import { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useMenuForm } from "../../components/MenuDetail/useMenuForm";

type Props = {
  ua: string;
};

const New: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  const router = useRouter();

  const targetDateString = useMemo(() => {
    if (typeof router.query.date === "string") {
      return router.query.date;
    }
    return "";
  }, []);

  const [targetDate, setTargetDate] = useState(
    parse(targetDateString, "yyyy-MM-dd", new Date())
  );

  const [calendar, , setCalendarDate] = useMonthlyCalendar(targetDate);

  const nextWeek = useCallback(() => {
    setCalendarDate((date) => addWeeks(date, 1));
    setTargetDate((date) => addWeeks(date, 1));
  }, []);

  const prevWeek = useCallback(() => {
    setCalendarDate((date) => subWeeks(date, 1));
    setTargetDate((date) => subWeeks(date, 1));
  }, []);

  const weekly = useMemo(() => {
    return calendar.find((week) =>
      week.some((date) => isSameDay(date, targetDate))
    );
  }, [calendar, targetDate]);

  const {
    form: { register },
    fieldArray: { fields, remove, append },
    importMenu,
    isLoadingImport,
  } = useMenuForm(null as any);

  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <div className="flex flex-col h-full">
          <header className="h-16 border-b"></header>
          <main className="h-full w-full flex flex-col overflow-auto">
            <form className="flex flex-col gap-3 w-full h-full  px-2 pt-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold">献立名</label>
                <input
                  className="border px-2 py-1 text-sm"
                  type="text"
                  {...register("title")}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold">レシピ</label>
                <div className="flex gap-2">
                  <input
                    className="border px-2 py-1 text-sm w-full"
                    type="text"
                    placeholder="URLを入力してください"
                    {...register("url")}
                  />
                  <Button
                    onClick={() => {
                      importMenu();
                    }}
                    loading={isLoadingImport}
                  >
                    読み取り
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-bold">材料</span>
                <div className="flex gap-2 items-center w-full">
                  <span className="text-sm w-3/4">材料名</span>
                  <span className="text-sm w-1/4">数量</span>
                  <div style={{ width: "18px" }}></div>
                </div>
                {fields.map((field, i) => (
                  <div
                    key={field.id}
                    className="flex gap-2 items-center w-full"
                  >
                    <input
                      className="border px-2 py-1 text-sm w-3/4"
                      type="text"
                      defaultValue={field.name}
                      {...register(`ingredientList.${i}.name` as const)}
                    />
                    <input
                      className="border px-2 py-1 text-sm w-1/4"
                      type="text"
                      defaultValue={field.amount}
                      {...register(`ingredientList.${i}.amount` as const)}
                    />
                    <MinusCircleOutlined
                      className="text-lg"
                      onClick={() => remove(i)}
                    />
                  </div>
                ))}
              </div>
              <div>
                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() =>
                    append({ name: "", amount: "", hasThis: false })
                  }
                >
                  材料を追加
                </Button>
              </div>
              <div className="flex gap-2 justify-center">
                <Button type="default" htmlType="submit">
                  破棄
                </Button>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </div>
            </form>
          </main>
        </div>
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

export default New;
