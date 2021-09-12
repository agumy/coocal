import { Button, Spin } from "antd";
import {
  CalendarOutlined,
  LeftOutlined,
  LoginOutlined,
  LogoutOutlined,
  SnippetsOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useUserContext } from "../../../context/UserContext";

type Props = {
  children: React.ReactNode;
  href?: string;
  hrefTitle?: string;
};

export const MobileContainer = ({
  children,
  href = "/",
  hrefTitle = "ホーム",
}: Props) => {
  const { user, isLoading, signOut } = useUserContext();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <header className="h-16 border-b flex justify-between items-center">
        <div>
          {router.pathname !== "/" && (
            <Link href={href}>
              <div className="flex items-center text-blue-600 gap-1 px-1">
                <LeftOutlined className="text-xl pl-2" />
                <span>{hrefTitle}</span>
              </div>
            </Link>
          )}
        </div>
        {!isLoading && (
          <div className="flex items-center justify-center mr-3">
            {user ? (
              <button onClick={signOut}>
                <LogoutOutlined className="text-2xl" />
              </button>
            ) : (
              <Link href="/sign-in">
                <LoginOutlined className="text-2xl" />
              </Link>
            )}
          </div>
        )}
      </header>
      {isLoading ? (
        <div className="h-full w-full flex justify-center items-center">
          <Spin tip="Loading..." />
        </div>
      ) : user || router.pathname === "/sign-in" ? (
        children
      ) : (
        <div className="h-full w-full flex flex-col items-center pt-5">
          <Link href="/sign-in">
            <Button className="w-56 rounded mb-4">ログイン</Button>
          </Link>
          <Button className="w-56 rounded">新規登録</Button>
        </div>
      )}
      <nav className="h-16 flex sticky border-t">
        <Link href="/">
          <div className="border-r w-1/4 flex items-center justify-center">
            <CalendarOutlined className="text-2xl" />
          </div>
        </Link>
        <Link href="/cart">
          <div className="border-r w-1/4 flex items-center justify-center">
            <UnorderedListOutlined className="text-2xl" />
          </div>
        </Link>
        <Link href="/wishlist">
          <div className="border-r w-1/4 flex items-center justify-center">
            <SnippetsOutlined className="text-2xl" />
          </div>
        </Link>
        <div className="border-r w-1/4 flex items-center justify-center">
          <UserOutlined className="text-2xl" />
        </div>
      </nav>
    </div>
  );
};
