import axios from "axios";
import { Menu } from "../models/Menu";
import AuthRepository from "./AuthRepository";

const URL =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5001/coocal/us-central1/api";

export default {
  get: async () => {},
  create: async (param: Omit<Menu, "author" | "id">): Promise<Menu> => {
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
