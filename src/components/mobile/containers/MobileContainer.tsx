import {
  CalendarOutlined,
  LeftOutlined,
  SnippetsOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

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
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <header className="h-16 border-b flex">
        {router.pathname !== "/" && (
          <Link href={href}>
            <div className="flex items-center text-blue-600 gap-1">
              <LeftOutlined className="text-xl pl-2" />
              <span>{hrefTitle}</span>
            </div>
          </Link>
        )}
      </header>
      {children}
      <nav className="h-16 flex sticky border-t">
        <Link href="/">
          <div className="border-r w-1/4 flex items-center justify-center">
            <CalendarOutlined className="text-2xl" />
          </div>
        </Link>
        <div className="border-r w-1/4 flex items-center justify-center">
          <UnorderedListOutlined className="text-2xl" />
        </div>
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
