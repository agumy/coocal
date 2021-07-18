import { useCallback, useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { format } from "../helper/calendar";
import { Menu } from "../models/Menu";

type MenuFormValue = {
  ingredientList: {
    name: string;
    amount: string;
    hasThis: boolean;
  }[];
  date: string | null;
  title: string;
  url: string;
  shared: boolean;
};

const defaultIngredient = { name: "", amount: "", hasThis: false };

export const useMenuForm = (menu?: Partial<Menu>) => {
  const form = useForm<MenuFormValue>({
    defaultValues: {
      ingredientList: [defaultIngredient],
      url: "",
      title: "",
      date: format(new Date()),
      shared: true,
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "ingredientList",
  });
  const appendRow = useCallback(() => {
    fieldArray.append({ name: "", amount: "", hasThis: false });
  }, [fieldArray]);

  useEffect(() => {
    if (menu) {
      form.setValue("title", menu.name ?? "");
      form.setValue("url", menu.url ?? "");
      form.setValue(
        "ingredientList",
        menu.ingredientList ?? [defaultIngredient]
      );
      form.setValue("date", menu.date ?? "");
    }
  }, [menu]);

  const isFetched = useRef(false);

  const { mutate: importMenu, isLoading: isLoadingImport } = useMutation(
    () =>
      fetch(
        `${window.location.origin}/api/ingredients?url=${form.getValues("url")}`
      ).then((res) => res.json()),
    {
      onSuccess: (data) => {
        if (data) {
          isFetched.current = true;
          form.setValue("ingredientList", data.ingredientList);
          form.setValue("title", data.title);
        }
      },
    }
  );

  return { form, fieldArray, appendRow, importMenu, isLoadingImport };
};
