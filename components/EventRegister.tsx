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
          setIngredients((state) => [...state, ...data.ingredientList]);
          setValue("title", data.title);
        }
      },
    }
  );

  const onClick = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col h-full w-full gap-2">
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
            onClick={onClick}
          >
            レシピからインポート
          </button>
        </div>
      </div>
      <div className="h-full w-full text-xs">
        <ol className="flex flex-col p-0 gap-1">
          {ingredients.map((ingredient, i) => (
            <li key={i} className="flex gap-2">
              <input
                className="py-1 px-2 w-full"
                type="text"
                placeholder="材料"
                value={ingredient.name}
              />
              <input
                className="py-1 px-2 w-16"
                type="text"
                placeholder="数量"
                value={ingredient.amount}
              />
            </li>
          ))}
        </ol>
      </div>
      <div className="flex justify-between items-center h-full">
        <button className="rounded border px-3 py-1 text-gray-500">
          材料を追加
        </button>
        <button className="rounded px-3 py-1 bg-blue-500 text-gray-100">
          登録
        </button>
      </div>
    </div>
  );
};
