import { Menu } from "../models/Menu";
import { fetch } from "./fetch";

export default {
  get: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): Promise<{ menus: Menu[] }> => {
    const response = await fetch({
      method: "GET",
      resource: `menu?startDate=${startDate}&endDate=${endDate}`,
    });
    return response.data;
  },
  create: async (
    param: Omit<Menu, "author" | "id">
  ): Promise<{ menu: Menu }> => {
    const response = await fetch({
      method: "POST",
      resource: `menu`,
      data: {
        ...param,
      },
    });
    return response.data;
  },
  delete: async (param: { id: string }): Promise<{ menu: { id: string } }> => {
    const response = await fetch({
      method: "DELETE",
      resource: `menu`,
      data: {
        ...param,
      },
    });
    return response.data;
  },
};
