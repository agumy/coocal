export const Calendar = () => {
  return (
    <div className="flex flex-wrap h-full w-full p-4">
      {[...Array(30).keys()].map(() => (
        <div className="w-1/7 " />
      ))}
    </div>
  );
};
