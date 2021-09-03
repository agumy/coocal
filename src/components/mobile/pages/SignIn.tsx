import { Button } from "antd";
import { MobileContainer } from "../containers/MobileContainer";

export const SignIn = () => {
  return (
    <MobileContainer>
      <div className="h-full w-full flex flex-col items-center pt-5">
        <div className="text-2xl font-bold mb-4 text-gray-600">ログイン</div>
        <input
          className="border border-gray-500 mb-4 rounded px-2 py-1 w-56"
          placeholder="メールアドレス"
        />
        <input
          className="border border-gray-500 mb-4 rounded px-2 py-1 w-56"
          placeholder="パスワード"
        />
        <Button className="w-56 rounded" type="primary">
          ログイン
        </Button>
      </div>
    </MobileContainer>
  );
};
