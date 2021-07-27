import { DesktopContainer } from "../DesktopContainer";
import { Calendar } from "../orgnisms/Calendar";
export const Home = () => {
  return (
    <DesktopContainer>
      <div className="h-full w-full flex flex-col">
        <Calendar />
      </div>
    </DesktopContainer>
  );
};
