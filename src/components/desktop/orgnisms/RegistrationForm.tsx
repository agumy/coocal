import { Button } from "antd";
import { useForm } from "react-hook-form";
import { useCreateUser } from "../../../hooks/useCreateUser";

export const RegistrationForm = () => {
  const userMutation = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    reValidateMode: "onBlur",
  });

  const signUp = handleSubmit(async (data) => {
    userMutation.mutate(data);
  });

  return (
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
  );
};
