type Props = {
  children: React.ReactNode;
};

export const MobileContainer = ({ children }: Props) => {
  return (
    <div className="flex flex-col h-full">
      <header className="h-16 border-b"></header>
      {children}
    </div>
  );
};
