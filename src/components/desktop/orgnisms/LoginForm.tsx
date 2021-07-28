import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Button } from "antd";
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
      className="w-1/3 h-auto border rounded-lg shadow bg-gray-100 flex flex-col justify-center p-4 gap-3 my-3"
    >
      <h1 className="text-2xl">ログイン</h1>
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
          })}
        />
        <div className="text-red-600 text-sm h-3">
          {errors.password && errors.password.message}
        </div>
      </label>

      <div className="mt-2 flex justify-end">
        <Button
          loading={signIn.isLoading}
          htmlType="submit"
          className="py-1 px-3 border rounded bg-white"
        >
          ログイン
        </Button>
      </div>
    </form>
  );
};
