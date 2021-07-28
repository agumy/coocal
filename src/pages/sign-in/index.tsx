import { NextPage } from "next";
import { DesktopContainer } from "../../components/desktop/containers/DesktopContainer";
import { LoginForm } from "../../components/desktop/orgnisms/LoginForm";

const Login: NextPage = () => {
  return (
    <DesktopContainer>
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <LoginForm />
      </div>
    </DesktopContainer>
  );
};

export default Login;
