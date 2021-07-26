import { NextPage } from "next";
import { useMemo, useState } from "react";
import { useUserAgent } from "next-useragent";
import { useForm } from "react-hook-form";
import { DesktopContainer } from "../../components/desktop/DesktopContainer";
import { Button, Spin } from "antd";
import { MobileContainer } from "../../components/mobile/containers/MobileContainer";
import { useUserContext } from "../../context/UserContext";
import { useCreateUser } from "../../hooks/useCreateUser";

type Props = {
  ua: string;
};
const Register: NextPage<Props> = ({ ua }) => {
  const device = useMemo(() => {
    // eslint-disable-next-line
    return useUserAgent(global.navigator?.userAgent ?? ua);
  }, [ua]);

  const { isLoading: isLoadingUser } = useUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    reValidateMode: "onBlur",
  });

  const userMutation = useCreateUser();

  const signUp = handleSubmit(async (data) => {
    userMutation.mutate(data);
  });

  return !device.isMobile ? (
    <DesktopContainer>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <form
          onSubmit={signUp}
          className="w-1/3 h-auto border rounded-lg shadow bg-gray-100 flex flex-col justify-center p-4 gap-3 my-3"
        >
          <h1 className="text-2xl">新規登録</h1>
          <label className="flex flex-col gap-1">
            <span className="text-lg">メールアドレス</span>
            <input
              type="text"
              className="py-1 px-2 rounded"
              {...register("email", {
                required: "メールアドレスを入力してください。",
              })}
            />
            <div className="text-red-600 text-sm h-3">
              {errors.email && errors.email.message}
            </div>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-lg">パスワード</span>
            <input
              type="password"
              className="py-1 px-2 rounded"
              {...register("password", {
                required: "パスワードを入力してください。",
                minLength: {
                  value: 8,
                  message: "パスワードは８文字以上で入力してください。",
                },
              })}
            />
            <div className="text-red-600 text-sm h-3">
              {errors.password && errors.password.message}
            </div>
          </label>

          <div className="mt-2 flex justify-end">
            <Button
              htmlType="submit"
              className="py-1 px-3 border rounded bg-white"
              loading={userMutation.isLoading}
            >
              新規登録
            </Button>
          </div>
        </form>
      </div>
    </DesktopContainer>
  ) : isLoadingUser ? (
    <div className="flex items-center justify-center h-full w-full">
      <Spin tip="Loading..." />
    </div>
  ) : (
    <MobileContainer>
      <div className="h-full w-full">TEST</div>
    </MobileContainer>
  );
};

export default Register;
