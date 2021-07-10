import { useCallback, useState, useReducer, useMemo } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useUserAgent } from "next-useragent";
import parse from "date-fns/parse";
import { useRouter } from "next/dist/client/router";
import { useMonthlyMenus } from "../../hooks/useMonthlyMenus";
import { Spin, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useMenuForm } from "../../hooks/useMenuForm";
import { useUpdateMenu } from "../../hooks/useUpdateMenu";
import { useDeleteMenu } from "../../hooks/useDeleteMenu";
import { format } from "../../helper/calendar";
import { MobileContainer } from "../../components/mobile/containers/MobileContainer";
import { WeekNavigator } from "../../components/mobile/organisms/WeekNavigator";

type Props = {
  ua: string;
};

const Menu: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    // eslint-disable-next-line
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  const router = useRouter();

  const targetDateString = useMemo(() => {
    if (typeof router.query.date === "string") {
      return router.query.date;
    }
    return "";
  }, []);

  const id = useMemo(() => {
    if (typeof router.query.id === "string") {
      return router.query.id;
    }
    return "";
  }, []);

  const [targetDate] = useState(
    parse(targetDateString, "yyyy-MM-dd", new Date())
  );

  const { data, isLoading } = useMonthlyMenus(targetDate);

  const menu = useMemo(() => {
    if (data) {
      return data.find((menu) => menu.id === id);
    }
  }, [data]);

  const {
    form: { register, handleSubmit, getValues, setValue },
    fieldArray: { fields, remove, append },
    importMenu,
    isLoadingImport,
    appendRow,
  } = useMenuForm(menu!);

  const update = useUpdateMenu(targetDate);
  const deleteMenu = useDeleteMenu(targetDate);

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (data) => {
        const ingredientList = data.ingredientList.filter(
          (i) => i.name && i.amount
        );
        if (menu) {
          await update.mutateAsync({
            ...menu,
            ...data,
            ingredientList,
          });

          toggle();
        }
      }),
    [handleSubmit, menu]
  );

  const onDelete = useCallback(async () => {
    if (menu) {
      await deleteMenu.mutateAsync({ id: menu.id });
      router.replace(`/menus?date=${format(targetDate)}`);
    }
  }, [deleteMenu, menu]);

  const [isEdit, toggle] = useReducer((prev) => !prev, false);

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
            {isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Spin tip="loading..." />
              </div>
            ) : (
              menu && (
                <div className="flex flex-col h-full">
                  <WeekNavigator
                    value={targetDate}
                    onSelect={(date) => {
                      router.push(`/menus?date=${format(date)}`);
                    }}
                  />
                  <main className="h-full w-full flex flex-col overflow-auto">
                    <form
                      className="flex flex-col gap-3 w-full h-full px-2 py-2"
                      onSubmit={onSubmit}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                          <label className="font-bold">献立名</label>
                          <Button
                            className="mb-1"
                            onClick={() => {
                              if (isEdit) {
                                setValue("ingredientList", menu.ingredientList);
                                setValue("title", menu.name);
                                setValue("url", menu.url);
                                setValue("shared", menu.shared);
                              }
                              toggle();
                            }}
                          >
                            {isEdit ? "中止" : "編集"}
                          </Button>
                        </div>
                        {isEdit ? (
                          <input
                            className="border px-2 py-1 text-sm"
                            type="text"
                            {...register("title")}
                          />
                        ) : (
                          <span className="py-1 text-sm">
                            {getValues("title")}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold">レシピ</label>
                        <div className="flex gap-2">
                          {isEdit ? (
                            <>
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
                            </>
                          ) : (
                            <a href={getValues("url")}>{getValues("url")}</a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
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
                            {isEdit ? (
                              <input
                                className="border px-2 py-1 text-sm w-3/4"
                                type="text"
                                defaultValue={field.name}
                                {...register(
                                  `ingredientList.${i}.name` as const
                                )}
                              />
                            ) : (
                              <span className="py-1 text-sm w-3/4">
                                {field.name}
                              </span>
                            )}
                            {isEdit ? (
                              <input
                                className="border px-2 py-1 text-sm w-1/4"
                                type="text"
                                defaultValue={field.amount}
                                {...register(
                                  `ingredientList.${i}.amount` as const
                                )}
                              />
                            ) : (
                              <span className="py-1 text-sm w-1/4">
                                {field.amount}
                              </span>
                            )}
                            <input
                              type="checkbox"
                              className="hidden"
                              defaultChecked={field.hasThis}
                              {...register(
                                `ingredientList.${i}.hasThis` as const
                              )}
                            />
                            {isEdit ? (
                              <MinusCircleOutlined
                                className="text-lg"
                                onClick={() => remove(i)}
                              />
                            ) : (
                              <div style={{ width: "18px" }}></div>
                            )}
                          </div>
                        ))}
                      </div>
                      {isEdit && (
                        <>
                          <div>
                            <Button
                              type="dashed"
                              block
                              icon={<PlusOutlined />}
                              onClick={appendRow}
                            >
                              材料を追加
                            </Button>
                          </div>
                          <div className="flex gap-2 justify-center">
                            <Button
                              onClick={onDelete}
                              type="default"
                              danger
                              htmlType="button"
                              loading={deleteMenu.isLoading}
                            >
                              削除
                            </Button>
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={update.isLoading}
                            >
                              保存
                            </Button>
                          </div>
                        </>
                      )}
                    </form>
                  </main>
                </div>
              )
            )}
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

export default Menu;
