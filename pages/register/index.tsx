import { NextPage } from "next";

const Register: NextPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="w-1/3 h-auto border rounded-lg shadow bg-gray-100 flex flex-col justify-center p-4 gap-3 my-3"
      >
        <label className="flex flex-col gap-1">
          <span className="text-lg">名前</span>
          <input type="text" className="py-1 px-2 rounded" />
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-lg">性別</span>
          <div className="flex gap-2">
            <label className="flex gap-1 items-center">
              <input
                name="gender"
                type="radio"
                className="py-1 px-2 rounded"
                defaultChecked
              />
              <span>男性</span>
            </label>
            <label className="flex gap-1 items-center">
              <input name="gender" type="radio" className="py-1 px-2 rounded" />
              <span>女性</span>
            </label>
            <label className="flex gap-1 items-center">
              <input name="gender" type="radio" className="py-1 px-2 rounded" />
              <span>その他</span>
            </label>
          </div>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-lg">生年月日</span>
          <input
            type="date"
            className="py-1 px-2 rounded"
            min="1900-01-01"
            max="2009-12-31"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-lg">メールアドレス</span>
          <input type="text" className="py-1 px-2 rounded" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-lg">パスワード</span>
          <input type="password" className="py-1 px-2 rounded" />
        </label>

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
