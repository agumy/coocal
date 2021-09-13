import { Button } from "antd";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSignIn } from "../../../hooks/useSignIn";

export const LoginForm = () => {
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
    <form
      onSubmit={submit}
      className="h-full w-full flex flex-col items-center pt-5"
    >
      <div className="text-2xl font-bold mb-4 text-gray-600">ログイン</div>
      <div className="mb-4 flex flex-col items-start">
        <input
          className="border border-gray-500 rounded px-2 py-1 w-56"
          type="text"
          placeholder="メールアドレス"
          {...register("email", {
            required: "メールアドレスを入力してください。",
          })}
        />
        {errors.email && (
          <div className="text-red-600 text-xs h-3 mt-1">
            {errors.email.message}
          </div>
        )}
      </div>
      <div className="mb-4 flex flex-col items-start">
        <input
          className="border border-gray-500 rounded px-2 py-1 w-56"
          type="password"
          placeholder="パスワード"
          {...register("password", {
            required: "パスワードを入力してください。",
          })}
        />
        {errors.password && (
          <div className="text-red-600 text-xs h-3 mt-1">
            {errors.password.message}
          </div>
        )}
      </div>
      <Button
        className="w-56 rounded"
        type="primary"
        htmlType="submit"
        loading={signIn.isLoading}
      >
        ログイン
      </Button>
    </form>
  );
};
