import groupBy from "lodash/groupBy";
import { useQuery } from "react-query";
import { useUserContext } from "../context/UserContext";
import { firestore } from "../firebase";
import { useMonthlyCalendar } from "./useMonthlyCalendar";

interface Ingredient {
  name: string;
  amount: string;
  hasThis: boolean;
}

export interface Menu {
  name: string;
  author: string;
  ingredientList: Ingredient[];
  date: Date;
}

type MenuDic = Record<string, Menu[]>;

export function useMenus(year: number, month: number) {
  const user = useUserContext();
  const [, days] = useMonthlyCalendar(year, month);

  const start = days[0];
  const end = days[days.length - 1];

  const query = useQuery(
    ["menus", start, user?.uid],
    () =>
      firestore
        .collection("menus")
        .where("author", "==", user?.uid)
        .orderBy("date", "asc")
        .startAt(start)
        .endAt(end)
        .get()
        .then(
          (res) =>
            groupBy(
              res.docs.map((d) => d.data()),
              (doc) => doc.date.toDate().toISOString()
            ) as MenuDic
        ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retryOnMount: true,
    }
  );

  return query;
}
