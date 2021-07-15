import Link from "next/link";
import { PlusCircleFilled } from "@ant-design/icons";

type Props = {
  href: string;
};
export const AddMenuButton = ({ href }: Props) => {
  return (
    <div className="fixed bottom-12 right-0">
      <Link href={href}>
        <PlusCircleFilled className="text-6xl pr-4 pb-4" />
      </Link>
    </div>
  );
};
