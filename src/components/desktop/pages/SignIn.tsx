import { DesktopContainer } from "../containers/DesktopContainer";
import { LoginForm } from "../orgnisms/LoginForm";

export const SignIn = () => {
  return (
    <DesktopContainer>
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <LoginForm />
      </div>
    </DesktopContainer>
  );
};
