import { useCallback, useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { Menu } from "../models/Menu";

type MenuFormValue = {
  ingredientList: {
    name: string;
    amount: string;
    hasThis: boolean;
  }[];
  title: string;
  url: string;
  shared: boolean;
};
export const useMenuForm = (menu: Menu) => {
  const form = useForm<MenuFormValue>({
    defaultValues: {
      ingredientList: [{ name: "", amount: "", hasThis: false }],
      url: "",
      title: "",
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
      form.setValue("title", menu.name);
      form.setValue("url", menu.url);
      form.setValue("ingredientList", menu.ingredientList);
    }
  }, [menu]);

  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) {
      isFetched.current = false;
      const willRemove = fieldArray.fields
        .map((f, i) => (!(f.name || f.amount) ? i : null))
        .filter((f) => typeof f === "number") as number[];
      fieldArray.remove(willRemove);
    }
  }, [fieldArray]);

  const { mutate: importMenu, isLoading: isLoadingImport } = useMutation(
    () =>
      fetch(
        `${window.location.origin}/api/ingredients?url=${form.getValues("url")}`
      ).then((res) => res.json()),
    {
      onSuccess: (data) => {
        if (data) {
          isFetched.current = true;
          fieldArray.append(data.ingredientList);
          form.setValue("title", data.title);
        }
      },
    }
  );

  return { form, fieldArray, appendRow, importMenu, isLoadingImport };
};
