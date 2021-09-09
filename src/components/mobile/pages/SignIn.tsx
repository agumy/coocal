import { Button } from "antd";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSignIn } from "../../../hooks/useSignIn";
import { MobileContainer } from "../containers/MobileContainer";

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    reValidateMode: "onBlur",
  });

  const router = useRouter();

  const signIn = useSignIn();

  const submit = useMemo(
    () =>
      handleSubmit(async (data) => {
        await signIn.mutateAsync(data);
        router.push("/");
      }),
    [handleSubmit, router, signIn]
  );

  return (
    <MobileContainer>
      <form
        onSubmit={submit}
        className="h-full w-full flex flex-col items-center pt-5"
      >
        <div className="text-2xl font-bold mb-4 text-gray-600">ログイン</div>
        <input
          className="border border-gray-500 mb-4 rounded px-2 py-1 w-56"
          type="text"
          placeholder="メールアドレス"
          {...register("email", {
            required: "メールアドレスを入力してください。",
          })}
        />
        <input
          className="border border-gray-500 mb-4 rounded px-2 py-1 w-56"
          type="password"
          placeholder="パスワード"
          {...register("password", {
            required: "パスワードを入力してください。",
          })}
        />
        <Button className="w-56 rounded" type="primary" htmlType="submit">
          ログイン
        </Button>
      </form>
    </MobileContainer>
  );
};
