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
  const { user } = useUserContext();
  const [, days] = useMonthlyCalendar(year, month);

  const start = days[0];
  const end = days[days.length - 1];

  const query = useQuery(
    ["menus", start, user?.uid],
    async () => {
      if (!user) {
        throw new Error("user must login");
      }

      const menusCollection = firestore.collection("menus");
      const [byUser, byScope] = await Promise.all([
        menusCollection
          .where("author", "==", user.uid)
          .orderBy("date", "asc")
          .startAt(start)
          .endAt(end)
          .get(),
      ]);
      const ids = Array.from(
        new Set([
          ...byUser.docs.map((d) => d.id),
          ...byScope.docs.map((d) => d.id),
        ])
      );
      const docs = ids.map(
        (id) => [...byUser.docs, ...byScope.docs].find((d) => d.id === id)!
      );
      return groupBy(docs, (doc) =>
        doc.data().date.toDate().toISOString()
      ) as unknown as MenuDic[];
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      retryOnMount: true,
    }
  );

  return query;
}
