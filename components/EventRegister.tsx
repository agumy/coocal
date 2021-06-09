import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";

export const EventRegister = () => {
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);

  const { handleSubmit, register, getValues, setValue } = useForm();

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
          setIngredients((state) =>
            [...state, ...data.ingredientList].filter((i) => i.name || i.amount)
          );
          setValue("title", data.title);
        }
      },
    }
  );

  const onClickImport = useCallback(() => {
    refetch();
  }, [refetch]);

  const onClickAddRow = useCallback(() => {
    setIngredients((state) => [...state, { name: "", amount: "" }]);
  }, [setIngredients]);

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
          {ingredients.map((ingredient, i) => (
            <li key={i} className="flex items-center gap-2">
              <input type="checkbox" {...register(`shouldBuy.${i}`)} />
              <input
                className="py-1 px-2 w-full border rounded"
                type="text"
                placeholder="材料"
                value={ingredient.name}
                {...register(`name.${i}`)}
              />
              <input
                className="py-1 px-2 w-16 border rounded"
                type="text"
                placeholder="数量"
                value={ingredient.amount}
                {...register(`amount.${i}`)}
              />
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
