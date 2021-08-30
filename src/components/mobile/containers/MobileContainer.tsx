import { Spin } from "antd";
import {
  CalendarOutlined,
  LeftOutlined,
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
  const { user, isLoading } = useUserContext();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <header className="h-16 border-b flex">
        {router.pathname !== "/" && (
          <Link href={href}>
            <div className="flex items-center text-blue-600 gap-1 px-1">
              <LeftOutlined className="text-xl pl-2" />
              <span>{hrefTitle}</span>
            </div>
          </Link>
        )}
      </header>
      {isLoading ? (
        <div className="h-full w-full flex justify-center items-center">
          <Spin tip="Loading..." />
        </div>
      ) : user ? (
        children
      ) : (
        <div className="h-full w-full">ログインしていません</div>
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
