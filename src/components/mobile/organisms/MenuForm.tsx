import Link from "next/link";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import DatePicker from "react-mobile-datepicker";
import { useMenuForm } from "../../../hooks/useMenuForm";
import { Menu } from "../../../models/Menu";
import { format, parse } from "../../../helper/calendar";
import { useCallback, useMemo, useReducer } from "react";
import { useRouter } from "next/dist/client/router";
import { useDeleteMenu } from "../../../hooks/useDeleteMenu";
import { useUpdateMenu } from "../../../hooks/useUpdateMenu";
import { useCreateMenu } from "../../../hooks/useCreateMenu";

type Props = {
  menu?: Menu;
  date: Date;
};

export const MenuForm = ({ menu, date }: Props) => {
  const router = useRouter();

  const hasMenu = useMemo(() => Boolean(menu), [menu]);
  const [isOpenDatePicker, toggleIsOpen] = useReducer((prev) => !prev, false);
  const [isEdit, toggle] = useReducer((prev) => !prev, !hasMenu);

  const _menu = useMemo(() => ({ date: format(date), ...menu }), [menu, date]);
  const {
    form: { register, getValues, setValue, handleSubmit },
    fieldArray: { fields, remove },
    appendRow,
    importMenu,
    isLoadingImport,
  } = useMenuForm(_menu);

  const createMenu = useCreateMenu(date);
  const updateMenu = useUpdateMenu(date);
  const deleteMenu = useDeleteMenu(date);

  const onDelete = useCallback(async () => {
    if (menu) {
      await deleteMenu.mutateAsync({ id: menu.id });
      router.replace(`/menus?date=${format(date)}`);
    }
  }, [deleteMenu, menu, date, router]);

  const submit = useMemo(
    () =>
      handleSubmit(async ({ title: name, ...data }) => {
        const ingredientList = data.ingredientList.filter(
          (i) => i.name && i.amount
        );

        if (menu) {
          await updateMenu.mutateAsync({
            ...menu,
            ...data,
          });
          toggle();
          return;
        }

        await createMenu.mutateAsync({
          ...data,
          name,
          ingredientList,
          date: format(date),
        });

        router.push(`/menus?date=${format(date)}`);
      }),
    [handleSubmit, createMenu, updateMenu, date, menu, router]
  );
  return (
    <form
      className="flex flex-col gap-3 w-full h-full px-2 py-2"
      onSubmit={submit}
    >
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-end">
          <label className="font-bold">献立名</label>
          {hasMenu && (
            <Button
              className="mb-1"
              onClick={() => {
                if (isEdit && menu) {
                  setValue("ingredientList", menu.ingredientList);
                  setValue("title", menu.name);
                  setValue("url", menu.url);
                  setValue("shared", menu.shared);
                  setValue("date", menu.date);
                }
                toggle();
              }}
            >
              {isEdit ? "中止" : "編集"}
            </Button>
          )}
        </div>
        {isEdit ? (
          <input
            className="border px-2 py-1 text-sm"
            type="text"
            {...register("title")}
          />
        ) : (
          <span className="py-1 text-sm">{getValues("title")}</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-bold">日付</label>
        <div className="flex gap-2">
          {isEdit ? (
            <input
              className="border px-2 py-1 text-sm"
              readOnly
              type="text"
              onClick={toggleIsOpen}
              value={new Intl.DateTimeFormat("ja-JP", {
                dateStyle: "long",
              }).format(parse(getValues("date")))}
            ></input>
          ) : (
            <span>
              {new Intl.DateTimeFormat("ja-JP", { dateStyle: "long" }).format(
                parse(getValues("date"))
              )}
            </span>
          )}
        </div>
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
          <div key={field.id} className="flex gap-2 items-center w-full">
            {isEdit ? (
              <input
                className="border px-2 py-1 text-sm w-3/4"
                type="text"
                defaultValue={field.name}
                {...register(`ingredientList.${i}.name` as const)}
              />
            ) : (
              <span className="py-1 text-sm w-3/4">{field.name}</span>
            )}
            {isEdit ? (
              <input
                className="border px-2 py-1 text-sm w-1/4"
                type="text"
                defaultValue={field.amount}
                {...register(`ingredientList.${i}.amount` as const)}
              />
            ) : (
              <span className="py-1 text-sm w-1/4">{field.amount}</span>
            )}
            <input
              type="checkbox"
              className="hidden"
              defaultChecked={field.hasThis}
              {...register(`ingredientList.${i}.hasThis` as const)}
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
            {hasMenu ? (
              <Button
                onClick={onDelete}
                type="default"
                danger
                htmlType="button"
                loading={deleteMenu.isLoading}
              >
                削除
              </Button>
            ) : (
              <Link href={`/menus?date=${format(date)}`} passHref>
                <Button type="default" htmlType="button">
                  破棄
                </Button>
              </Link>
            )}
            <Button
              type="primary"
              htmlType="submit"
              loading={updateMenu.isLoading || createMenu.isLoading}
            >
              保存
            </Button>
          </div>
        </>
      )}
      <DatePicker
        isOpen={isOpenDatePicker}
        onSelect={(value: Date) => {
          setValue("date", format(value));
          toggleIsOpen();
        }}
        onCancel={toggleIsOpen}
        value={parse(getValues("date"))}
        dateConfig={{
          year: {
            format: "YYYY",
            step: 1,
          },
          month: {
            format: "MM",
            step: 1,
          },
          date: {
            format: "DD",
            step: 1,
          },
        }}
      />
    </form>
  );
};
