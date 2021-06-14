import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { useUserContext } from "../context/UserContext";
import { firestore } from "../firebase";

type MenuFormValue = {
  ingredientList: {
    name: string;
    amount: string;
    hasThis: boolean;
  }[];
  title: string;
  url: string;
};

interface Props {
  date: Date;
}

export const EventRegister = ({ date }: Props) => {
  const user = useUserContext();

  const { register, control, getValues, setValue, handleSubmit } =
    useForm<MenuFormValue>({
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
          isFetched.current = true;
          append(data.ingredientList);
          setValue("title", data.title);
        }
      },
    }
  );

  const mutation = useMutation(
    (newMenu: {
      author: string;
      date: Date;
      name: string;
      ingredientList: { name: string; amount: string; hasThis: boolean }[];
    }) => firestore.collection("menus").add(newMenu)
  );

  const onClickImport = useCallback(() => {
    refetch();
  }, [refetch]);

  const onClickAddRow = useCallback(() => {
    append({ name: "", amount: "", hasThis: false });
  }, []);

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (data) => {
        if (user) {
          const ingredientList = data.ingredientList.filter(
            (i) => i.name && i.amount
          );

          mutation.mutate({
            author: user.uid,
            date: date,
            name: data.title,
            ingredientList,
          });
        }
      }),
    [user, handleSubmit]
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
        <button
          className="rounded px-3 py-1 bg-blue-500 text-gray-100"
          type="submit"
        >
          登録
        </button>
      </div>
    </form>
  );
};
