import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { useFieldArray, useForm } from "react-hook-form";

type MenuFormValue = {
  ingredientList: {
    name: string;
    amount: string;
    hasThis: boolean;
  }[];
  title: string;
  url: string;
};

export const EventRegister = () => {
  const { register, control, getValues } = useForm<MenuFormValue>({
    defaultValues: {
      ingredientList: [{ name: "", amount: "", hasThis: false }],
      url: "",
      title: "",
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "ingredientList",
    }
  );

  const { isLoading, error, data, refetch } = useQuery(
    `ingredients`,
    () =>
      fetch(
        `http://localhost:3000/api/ingredient?url=${getValues("url")}`
      ).then((res) => res.json()),
    {
      enabled: false,
      onSuccess: (data) => {
        if (data) {
          append(data.ingredientList);
        }
      },
    }
  );

  const onClickImport = useCallback(() => {
    // const willRemove = fields
    //   .map((f, i) => (!(f.name || f.amount) ? i : null))
    //   .filter((f) => typeof f === "number") as number[];
    // console.log(willRemove);
    // remove(willRemove);
    refetch();
  }, [refetch]);

  const onClickAddRow = useCallback(() => {
    append({ name: "", amount: "", hasThis: false });
  }, []);

  return (
    <div className="flex flex-col h-full w-full gap-3">
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
          <button
            className="border px-2 h-full rounded text-gray-500 whitespace-nowrap"
            onClick={onClickImport}
          >
            レシピからインポート
          </button>
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
        <button
          className="rounded border px-3 py-1 text-gray-500"
          onClick={onClickAddRow}
        >
          材料を追加
        </button>
        <button className="rounded px-3 py-1 bg-blue-500 text-gray-100">
          登録
        </button>
      </div>
    </div>
  );
};
