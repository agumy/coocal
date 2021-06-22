import axios from "axios";
import { Menu } from "../models/Menu";
import AuthRepository from "./AuthRepository";

const URL =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5001/coocal/us-central1/api";

export default {
  get: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): Promise<{ menus: Menu[] }> => {
    const token = await AuthRepository.getToken();
    const response = await axios({
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: `${URL}/menu?startDate=${startDate}&endDate=${endDate}`,
    });
    return response.data;
  },
  create: async (
    param: Omit<Menu, "author" | "id">
  ): Promise<{ menu: Menu }> => {
    const token = await AuthRepository.getToken();
    const response = await axios({
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
      url: `${URL}/menu`,
      data: {
        ...param,
      },
    });
    return response.data;
  },
};
