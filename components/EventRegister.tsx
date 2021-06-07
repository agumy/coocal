import { SyntheticEvent, useCallback, useState } from "react";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";

const useUrl = (initialState: string = "") => {
  const [url, __setUrl] = useState(initialState);

  const setUrl = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
    __setUrl(e.currentTarget.value);
  }, []);

  return [url, setUrl] as const;
};

export const EventRegister = () => {
  // const { isLoading, error, data, refetch } = useQuery(
  //   `ingredients-${url}`,
  //   () =>
  //     fetch(`http://localhost:3000/api/ingredient?url=${url}`).then((res) =>
  //       res.json()
  //     ),
  //   { enabled: false }
  // );

  // const onClick = useCallback(() => {
  //   refetch();
  // }, [refetch]);

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex w-full h-11">
        <input type="text" placeholder="Title" className="p-2 w-full text-lg" />
      </div>
      <div className="h-full w-full text-xs">
        <div className="w-full flex items-center gap-2 h-6">
          <input
            type="text"
            placeholder="URL"
            className="p-2 h-full w-full border"
          />
          <button className="border px-2 h-full rounded text-gray-500">
            Import
          </button>
        </div>
      </div>
      <div className="h-full w-full text-xs">
        <ol className="flex flex-col p-0 gap-1">
          {[...Array(3).keys()].map((n) => (
            <li key={n} className="flex gap-2">
              <input
                className="py-1 px-2 w-full"
                type="text"
                placeholder="ingredient"
              />
              <input
                className="py-1 px-2 w-16"
                type="text"
                placeholder="amount"
              />
            </li>
          ))}
        </ol>
      </div>
      <div className="flex justify-end items-end h-full">
        <button className="rounded border px-3 py-1 bg-blue-500 text-gray-100">
          登録
        </button>
      </div>
    </div>
  );
};
