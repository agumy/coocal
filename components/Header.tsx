import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import firebase from "firebase";
import { auth } from "../firebase";

export const Header = () => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((state) => {
      setUser(state);
    });
  }, [setUser]);

  const logout = useCallback(async () => {
    await auth.signOut();
  }, [auth]);

  return (
    <header className="h-32 w-full bg-blue-200 flex items-center justify-between px-4">
      <div>
        <Link href="/">
          <h1 tabIndex={0} role="link" className="text-gray-500 cursor-pointer">
            Coocal
          </h1>
        </Link>
      </div>
      <div className="flex items-center justify-end gap-2">
        {!user && (
          <Link href="/sign-up">
            <span
              tabIndex={0}
              role="link"
              className="border border-gray-500 rounded py-1 px-2 text-gray-500 cursor-pointer"
            >
              登録
            </span>
          </Link>
        )}
        {user ? (
          <button
            onClick={logout}
            className="border border-gray-500 rounded py-1 px-2 text-gray-500"
          >
            ログアウト
          </button>
        ) : (
          <Link href="/sign-in">
            <span
              tabIndex={0}
              role="link"
              className="border border-gray-500 rounded py-1 px-2 text-gray-500 cursor-pointer"
            >
              ログイン
            </span>
          </Link>
        )}
      </div>
    </header>
  );
};
