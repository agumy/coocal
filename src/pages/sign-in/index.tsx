import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../../firebase";
import { generateMessageByCode } from "../../helper/generateMessageByCode";
import Spinner from "react-bootstrap/Spinner";
import { DesktopContainer } from "../../components/DesktopContainer";

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    reValidateMode: "onBlur",
  });

  const [error, setError] = useState("");

  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const signIn = useMemo(
    () =>
      handleSubmit(async (data) => {
        if (data.email && data.password) {
          setLoading(true);
          try {
            await auth.signInWithEmailAndPassword(data.email, data.password);
            router.push("/");
          } catch (error) {
            setError(generateMessageByCode(error.code));
          } finally {
            setLoading(false);
          }
        }
      }),
    [auth, handleSubmit]
  );

  return (
    <DesktopContainer>
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <form
          onSubmit={signIn}
          className="w-1/3 h-auto border rounded-lg shadow bg-gray-100 flex flex-col justify-center p-4 gap-3 my-3"
        >
          <h1 className="text-2xl">ログイン</h1>
          {Boolean(error) && (
            <span className="text-red-600 text-sm">{error}</span>
          )}
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
                "ログイン"
              )}
            </button>
          </div>
        </form>
      </div>
    </DesktopContainer>
  );
};

export default Login;
