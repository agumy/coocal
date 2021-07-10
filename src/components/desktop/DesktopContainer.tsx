import { Header } from "./Header";

type Props = {
  children: React.ReactNode;
};

export const DesktopContainer = ({ children }: Props) => {
  return (
    <div className="h-screen w-screen flex flex-col text-gray-600 bg-blue-100">
      <Header />
      {children}
    </div>
  );
};
