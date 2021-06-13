import { NextPage } from "next";
import { useForm } from "react-hook-form";
import isValid from "date-fns/isValid";
import { useMemo } from "react";
import { firestore } from "../../firebase";
import { useUserContext } from "../../context/UserContext";
import { useRouter } from "next/dist/client/router";

const Register: NextPage = () => {
  const user = useUserContext();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; gender: string; birthday: Date }>({
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      gender: "male",
      birthday: "",
    },
  });

  const onSubmit = useMemo(
    () =>
      handleSubmit(async ({ name, birthday, gender }) => {
        await firestore.collection("users").doc(user?.uid).set({
          name,
          birthday,
          gender,
        });
        router.push("/");
      }),
    [handleSubmit]
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-1/3 h-auto border rounded-lg shadow bg-gray-100 flex flex-col justify-center p-4 gap-1 my-3"
      >
        <label className="flex flex-col gap-1">
          <span className="text-lg">名前</span>
          <input
            type="text"
            className="py-1 px-2 rounded"
            {...register("name", { required: "名前を入力してください" })}
          />
          <div className="text-red-600 text-sm h-3">
            {errors.name && errors.name.message}
          </div>
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-lg">性別</span>
          <div className="flex gap-2">
            <label className="flex gap-1 items-center">
              <input
                type="radio"
                className="py-1 px-2 rounded"
                value="male"
                {...register("gender")}
              />
              <span>男性</span>
            </label>
            <label className="flex gap-1 items-center">
              <input
                type="radio"
                className="py-1 px-2 rounded"
                value="female"
                {...register("gender")}
              />
              <span>女性</span>
            </label>
            <label className="flex gap-1 items-center">
              <input
                type="radio"
                className="py-1 px-2 rounded"
                value="other"
                {...register("gender")}
              />
              <span>その他</span>
            </label>
          </div>
          <div className="text-red-600 text-sm h-3">
            {errors.gender && errors.gender.message}
          </div>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-lg">生年月日</span>
          <input
            type="date"
            className="py-1 px-2 rounded"
            min="1900-01-01"
            max="2009-12-31"
            {...register("birthday", {
              required: "生年月日を入力してください。",
              valueAsDate: true,
              validate: (value) =>
                isValid(value) || "正しい生年月日を入力してください。",
            })}
          />
        </label>
        <div className="text-red-600 text-sm h-3">
          {errors.birthday && errors.birthday.message}
        </div>

        <div className="mt-2 flex justify-end">
          <input
            className="py-1 px-3 border rounded bg-white"
            type="submit"
            value="登録"
          />
        </div>
      </form>
    </div>
  );
};

export default Register;