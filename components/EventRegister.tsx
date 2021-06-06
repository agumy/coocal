import { SyntheticEvent, useCallback, useState } from "react";
import { useQuery } from "react-query";

const useUrl = (initialState: string = "") => {
  const [url, __setUrl] = useState(initialState);

  const setUrl = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
    __setUrl(e.currentTarget.value);
  }, []);

  return [url, setUrl] as const;
};

export const EventRegister = () => {
  const [url, setUrl] = useUrl();

  const { isLoading, error, data, refetch } = useQuery(
    `ingredients-${url}`,
    () =>
      fetch(`http://localhost:3000/api/ingredient?url=${url}`).then((res) =>
        res.json()
      ),
    { enabled: false }
  );

  const onClick = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col h-24 w-full">
      <div className="flex w-full h-11">
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={setUrl}
          className="p-3 w-full"
        />
      </div>
      <div className="flex justify-end items-end h-full">
        <button
          className="rounded border px-3 py-1 bg-blue-500 text-gray-100"
          onClick={onClick}
        >
          登録
        </button>
      </div>
    </div>
  );
};
