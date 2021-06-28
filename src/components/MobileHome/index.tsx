export const MobileHome = () => {
  return (
    <div className="w-full flex flex-col">
      <header className="w-full h-40 sticky top-0 border bg-white"></header>
      <main className="w-full flex flex-col">
        {[...Array(8).keys()].map((n) => (
          <div className="w-full h-1/6 flex justify-center items-center aspect-fix-60 border-b">
            {n}
          </div>
        ))}
      </main>
    </div>
  );
};
