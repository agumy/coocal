import { NextPage } from "next";
import { useUserAgent } from "next-useragent";
import parse from "date-fns/parse";
import { useRouter } from "next/dist/client/router";
import { useMemo, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useMenuForm } from "../../hooks/useMenuForm";
import { useCreateMenu } from "../../hooks/useCreateMenu";
import { format } from "../../helper/calendar";
import { WeekNavigator } from "../../components/mobile/organisms/WeekNavigator";
import Link from "next/link";
import { MobileContainer } from "../../components/mobile/containers/MobileContainer";

type Props = {
  ua: string;
};

const New: NextPage<Props> = ({ ua }) => {
  const device = useUserAgent(global.navigator?.userAgent ?? {});

  const router = useRouter();

  const targetDateString = useMemo(() => {
    if (typeof router.query.date === "string") {
      return router.query.date;
    }
    return "";
  }, [router.query.date]);

  const [targetDate, setTargetDate] = useState(
    parse(targetDateString, "yyyy-MM-dd", new Date())
  );

  const {
    form: { register, handleSubmit },
    fieldArray: { fields, remove, append },
    importMenu,
    isLoadingImport,
  } = useMenuForm(null as any);

  const { mutate, isLoading } = useCreateMenu(targetDate);

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (data) => {
        const ingredientList = data.ingredientList.filter(
          (i) => i.name && i.amount
        );

        await mutate({
          date: format(targetDate),
          name: data.title,
          shared: data.shared,
          ingredientList,
          url: data.url,
        });

        router.push(`/menus?date=${format(targetDate)}`);
      }),
    [handleSubmit, mutate, router, targetDate]
  );

  return (
    <>
      {!device.isMobile ? (
        <div></div>
      ) : (
        <MobileContainer
          hrefTitle="一覧"
          href={`/menus?date=${format(targetDate)}`}
        >
          <main className="h-full w-full flex flex-col overflow-auto">
            <WeekNavigator
              value={targetDate}
              onSelect={(date) => setTargetDate(date)}
            />
            <form
              className="flex flex-col gap-3 w-full h-full px-2 py-3"
              onSubmit={onSubmit}
            >
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
                    <input
                      type="checkbox"
                      className="hidden"
                      defaultChecked={field.hasThis}
                      {...register(`ingredientList.${i}.hasThis` as const)}
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
                <Link href={`/menus?date=${format(targetDate)}`} passHref>
                  <Button type="default" htmlType="button">
                    破棄
                  </Button>
                </Link>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  保存
                </Button>
              </div>
            </form>
          </main>
        </MobileContainer>
      )}
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const ua = req.headers["user-agent"];

//   return {
//     props: {
//       ua,
//     },
//   };
// };

export default New;
