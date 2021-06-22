import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { useUserContext } from "../context/UserContext";
import format from "date-fns/format";
import MenuRepository from "../repository/MenuRepository";
import { Menu } from "../models/Menu";

type MenuFormValue = {
  ingredientList: {
    name: string;
    amount: string;
    hasThis: boolean;
  }[];
  title: string;
  url: string;
  shared: boolean;
};

interface Props {
  date: Date;
  menu: Menu;
}

export const EventRegister = ({ date, menu }: Props) => {
  const { user } = useUserContext();

  const { register, control, getValues, setValue, handleSubmit } =
    useForm<MenuFormValue>({
      defaultValues: {
        ingredientList: [{ name: "", amount: "", hasThis: false }],
        url: "",
        title: "",
        shared: true,
      },
    });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "ingredientList",
  });

  useEffect(() => {
    if (menu) {
      setValue("title", menu.name);
      setValue("url", menu.url);
      insert(0, menu.ingredientList);
    }
  }, [menu]);

  const isFetched = useRef(false);
  useEffect(() => {
    if (isFetched.current) {
      isFetched.current = false;
      const willRemove = fields
        .map((f, i) => (!(f.name || f.amount) ? i : null))
        .filter((f) => typeof f === "number") as number[];
      remove(willRemove);
    }
  }, [fields]);

  const { refetch: importMenu } = useQuery(
    `ingredients`,
    () =>
      fetch(
        `http://localhost:3000/api/ingredients?url=${getValues("url")}`
      ).then((res) => res.json()),
    {
      enabled: false,
      onSuccess: (data) => {
        if (data) {
          isFetched.current = true;
          append(data.ingredientList);
          setValue("title", data.title);
        }
      },
    }
  );

  const mutation = useMutation(
    (newMenu: {
      date: string;
      name: string;
      url: string;
      ingredientList: { name: string; amount: string; hasThis: boolean }[];
      shared: boolean;
    }) => MenuRepository.create(newMenu),
    {
      onSuccess: (data, variables, context) => {
        document.body.click();
      },
    }
  );

  const onClickImport = useCallback(() => {
    importMenu();
  }, [importMenu]);

  const onClickAddRow = useCallback(() => {
    append({ name: "", amount: "", hasThis: false });
  }, []);

  const onSubmit = useMemo(
    () =>
      handleSubmit((data) => {
        if (user) {
          const ingredientList = data.ingredientList.filter(
            (i) => i.name && i.amount
          );

          mutation.mutate({
            date: format(date, "yyyy-MM-dd"),
            name: data.title,
            shared: data.shared,
            ingredientList,
            url: data.url,
          });
        }
      }),
    [user, handleSubmit, mutation]
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
          <button
            type="button"
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
        <div>
          <button
            className="rounded border px-3 py-1 text-gray-500"
            onClick={onClickAddRow}
          >
            材料を追加
          </button>
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-1">
            <input type="checkbox" {...register("shared")} />
            <span>共有</span>
          </label>
          <button
            className="rounded px-3 py-1 bg-blue-500 text-gray-100"
            type="submit"
          >
            登録
          </button>
        </div>
      </div>
    </form>
  );
};
