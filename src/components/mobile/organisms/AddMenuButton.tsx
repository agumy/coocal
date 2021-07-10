import Link from "next/link";
import { PlusCircleFilled } from "@ant-design/icons";

import { format } from "../../../helper/calendar";
import { useMemo } from "react";

type Props = {
  date?: Date;
};
export const AddMenuButton = ({ date }: Props) => {
  const href = useMemo(() => {
    if (date) {
      return `/menu/new?date=${format(date)}`;
    }
    return "menu/new";
  }, [date]);

  return (
    <div className="fixed bottom-12 right-0">
      <Link href={href}>
        <PlusCircleFilled className="text-6xl pr-4 pb-4" />
      </Link>
    </div>
  );
};
