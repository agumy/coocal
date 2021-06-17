import { NextPage } from "next";
import Link from "next/link";
import { useCallback, useReducer } from "react";
import { useUserContext } from "../../context/UserContext";
import Toast from "react-bootstrap/Toast";

const Verify: NextPage = () => {
  const { user } = useUserContext();

  const [isShow, toggle] = useReducer((prev) => !prev, false);

  const onClick = useCallback(async () => {
    if (user) {
      const ACTION_CODE_SETTINGS = {
        url: "http://localhost:3000/sign-up/verified",
        // This must be true.
        handleCodeInApp: true,
      };
      await user.sendEmailVerification();
      toggle();
    }
  }, [user]);

  return (
    <div className="h-full w-full relative">
      <Toast
        autohide
        delay={3000}
        show={isShow}
        onClose={toggle}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <Toast.Body>確認用メールを再送しました。</Toast.Body>
      </Toast>
      <div className="flex flex-col items-center h-full w-full p-4">
        {user ? (
          <section className="flex flex-col gap-2">
            <h1>確認用のメールを送信しました。</h1>
            <span className="text flex flex-col ">
              <span>
                <span className="font-bold">{user?.email}</span>{" "}
                へ確認用のメールを送信しました。
              </span>
              <span>
                メールをご確認いただき、メールに記載された URL
                をクリックして登録を完了してください。
              </span>
              <span className="mt-2">
                メールが届いていない場合は
                <span
                  role="button"
                  onClick={onClick}
                  className="text-blue-500 underline"
                >
                  こちら
                </span>
              </span>
            </span>
          </section>
        ) : (
          "無効なページです"
        )}
      </div>
    </div>
  );
};

export default Verify;
