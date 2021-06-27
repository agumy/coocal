import { useMemo } from "react";
import Spinner from "react-bootstrap/Spinner";

import { Menu } from "../../models/Menu";
import { useCreateMenu } from "../../hooks/useCreateMenu";
import { format } from "../../helper/calendar";
import { useMenuForm } from "./useMenuForm";
import { Button } from "antd";

interface Props {
  date: Date;
  menu: Menu;
}

export const MenuDetail = ({ date, menu }: Props) => {
  const {
    form: { register, handleSubmit },
    fieldArray: { fields, remove },
    importMenu,
    appendRow,
    isLoadingImport,
  } = useMenuForm(menu);

  const { mutate, isLoading } = useCreateMenu(date);

  const onSubmit = useMemo(
    () =>
      handleSubmit((data) => {
        const ingredientList = data.ingredientList.filter(
          (i) => i.name && i.amount
        );

        mutate({
          date: format(date),
          name: data.title,
          shared: data.shared,
          ingredientList,
          url: data.url,
        });
      }),
    [handleSubmit, mutate]
  );

  return (
    <form className="flex flex-col h-full w-full gap-3" onSubmit={onSubmit}>
      <div className="flex w-full h-11">
        <input
          type="text"
          placeholder="献立"
          className="p-2 w-full text-lg"
          {...register("title")}
        />
      </div>
      <div className="h-full w-full text-xs">
        <div className="w-full flex items-center gap-2 h-6">
          <input
            type="text"
            placeholder="URL"
            className="p-2 h-full w-full border rounded"
            {...register("url")}
          />
          <Button
            type="default"
            className="border px-2 h-full rounded text-gray-500 whitespace-nowrap"
            onClick={() => {
              importMenu();
            }}
            loading={isLoadingImport}
          >
            レシピからインポート
          </Button>
        </div>
      </div>
      <div className="h-full w-full text-xs">
        <ol className="flex flex-col p-0 gap-1">
          {fields.map((field, i) => (
            <li key={field.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked={field.hasThis}
                {...register(`ingredientList.${i}.hasThis` as const)}
              />
              <input
                className="py-1 px-2 w-full border rounded"
                type="text"
                placeholder="材料"
                defaultValue={field.name}
                {...register(`ingredientList.${i}.name` as const)}
              />
              <input
                className="py-1 px-2 w-16 border rounded"
                type="text"
                placeholder="数量"
                defaultValue={field.amount}
                {...register(`ingredientList.${i}.amount` as const)}
              />
              <button
                className="py-1 px-2 border rounded whitespace-nowrap"
                onClick={() => {
                  remove(i);
                }}
              >
                削除
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex justify-between items-center h-full">
        <div>
          <button
            className="rounded border px-3 py-1 text-gray-500"
            onClick={appendRow}
          >
            材料を追加
          </button>
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-1">
            <input type="checkbox" {...register("shared")} />
            <span>共有</span>
          </label>
          <Button
            className="rounded px-3 py-1 bg-blue-500 text-gray-100"
            type="primary"
            loading={isLoading}
            onClick={onSubmit}
          >
            登録
          </Button>
        </div>
      </div>
    </form>
  );
};
