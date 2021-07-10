import { useCallback, useReducer } from "react";
import Link from "next/link";
import { auth } from "../../firebase";
import { useUserContext } from "../../context/UserContext";
import { SharedConfigModal } from "./SharedConfigModal";

export const Header = () => {
  const { user } = useUserContext();

  const logout = useCallback(async () => {
    await auth.signOut();
  }, [auth]);

  const [show, toggle] = useReducer((prev) => !prev, false);

  return (
    <>
      <header className="h-32 w-full bg-blue-200 flex items-center justify-between px-4">
        <div>
          <Link href="/">
            <h1
              tabIndex={0}
              role="link"
              className="text-gray-500 cursor-pointer"
            >
              Coocal
            </h1>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-2">
          {user ? (
            <>
              <span>{user.email} でログイン中</span>
              {user.emailVerified && (
                <button
                  onClick={() => {
                    toggle();
                  }}
                  className="border border-gray-500 rounded py-1 px-2 text-gray-500"
                >
                  共有設定
                </button>
              )}
              <button
                onClick={logout}
                className="border border-gray-500 rounded py-1 px-2 text-gray-500"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-up">
                <span
                  tabIndex={0}
                  role="link"
                  className="border border-gray-500 rounded py-1 px-2 text-gray-500 cursor-pointer"
                >
                  登録
                </span>
              </Link>
              <Link href="/sign-in">
                <span
                  tabIndex={0}
                  role="link"
                  className="border border-gray-500 rounded py-1 px-2 text-gray-500 cursor-pointer"
                >
                  ログイン
                </span>
              </Link>
            </>
          )}
        </div>
      </header>
      <SharedConfigModal visible={show} onCancel={toggle} />
    </>
  );
};
