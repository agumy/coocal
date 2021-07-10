import { LeftOutlined } from "@ant-design/icons";
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
    </div>
  );
};
