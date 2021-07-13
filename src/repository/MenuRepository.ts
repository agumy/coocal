import { Menu } from "../models/Menu";
import { fetch } from "./fetch";

const MenuRepository = {
  get: async (period?: {
    startDate: string;
    endDate: string;
  }): Promise<Menu[]> => {
    if (period) {
      const response = await fetch({
        method: "GET",
        resource: `menu?startDate=${period.startDate}&endDate=${period.endDate}`,
      });
      return response.data.menus;
    }
    const response = await fetch({
      method: "GET",
      resource: `menu`,
    });
    return response.data.menus;
  },
  create: async (param: Omit<Menu, "author" | "id">): Promise<Menu> => {
    const response = await fetch({
      method: "POST",
      resource: `menu`,
      data: {
        ...param,
      },
    });
    return response.data;
  },
  update: async (param: Menu): Promise<Menu> => {
    const response = await fetch({
      method: "PUT",
      resource: `menu`,
      data: {
        ...param,
      },
    });
    return response.data.menu;
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

export default MenuRepository;
