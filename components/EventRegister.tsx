export const EventRegister = () => {
  return (
    <div className="flex flex-col h-24 w-full">
      <div className="flex w-full h-11">
        <input type="text" placeholder="URL" className="p-3 w-full" />
      </div>
      <div className="flex justify-end items-end h-full">
        <button className="rounded border px-3 py-1 bg-blue-500 text-gray-100">
          登録
        </button>
      </div>
    </div>
  );
};
