import { DesktopContainer } from "../containers/DesktopContainer";
import { RegistrationForm } from "../orgnisms/RegistrationForm";

export const SignUp = () => {
  return (
    <DesktopContainer>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <RegistrationForm />
      </div>
    </DesktopContainer>
  );
};
