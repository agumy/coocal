import { Button } from "antd";
import { useForm } from "react-hook-form";
import { MobileContainer } from "../containers/MobileContainer";

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    reValidateMode: "onBlur",
  });

  return (
    <MobileContainer>
      <div className="h-full w-full flex flex-col items-center pt-5">
        <div className="text-2xl font-bold mb-4 text-gray-600">ログイン</div>
        <input
          className="border border-gray-500 mb-4 rounded px-2 py-1 w-56"
          placeholder="メールアドレス"
          {...register("email", {
            required: "メールアドレスを入力してください。",
          })}
        />
        <input
          className="border border-gray-500 mb-4 rounded px-2 py-1 w-56"
          placeholder="パスワード"
          {...register("password", {
            required: "パスワードを入力してください。",
          })}
        />
        <Button className="w-56 rounded" type="primary">
          ログイン
        </Button>
      </div>
    </MobileContainer>
  );
};
