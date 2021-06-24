import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../../firebase";
import Spinner from "react-bootstrap/Spinner";

const Register: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    reValidateMode: "onBlur",
  });

  const [isLoading, setLoading] = useState(false);

  const signUp = handleSubmit(async (data) => {
    if (data.email && data.password) {
      setLoading(true);
      try {
        const result = await auth.createUserWithEmailAndPassword(
          data.email,
          data.password
        );
        if (result.user) {
          const ACTION_CODE_SETTINGS = {
            url: `${window.location.origin}/sign-up/verified`,
            handleCodeInApp: true,
          };
          await result.user.sendEmailVerification(ACTION_CODE_SETTINGS);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
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
          <button type="submit" className="py-1 px-3 border rounded bg-white">
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </>
            ) : (
              "新規登録"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
